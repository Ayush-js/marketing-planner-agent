# agents/crew.py

import os
import json
import sys
from datetime import datetime
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process, LLM
from crewai.tools import tool

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.budget_checker import check_budget
from tools.team_availability import check_team_availability
from tools.timeline_validator import validate_timeline

# ── LLM Setup using CrewAI's own LLM class ────────────────
llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.environ.get("GROQ_API_KEY"),
    temperature=0.3,
)

# ── CrewAI Tool Wrappers ───────────────────────────────────

@tool("Budget Checker Tool")
def budget_checker_tool(task_name: str, estimated_cost: float) -> str:
    """
    Checks if the budget is available for a given task.
    Input: task_name (string), estimated_cost (float in USD).
    Returns approval status and available budget.
    """
    result = check_budget(task_name, estimated_cost)
    return json.dumps(result)


@tool("Team Availability Tool")
def team_availability_tool(task_name: str, team_members: str) -> str:
    """
    Checks if team members are available for a task.
    Input: task_name (string), team_members (comma-separated string
    e.g. 'content_writer,data_analyst').
    Returns availability status for each member.
    """
    members = [m.strip() for m in team_members.split(",")]
    result = check_team_availability(task_name, members)
    return json.dumps(result)


@tool("Timeline Validator Tool")
def timeline_validator_tool(task_name: str, start_day: int, duration_days: int) -> str:
    """
    Validates if a task fits within the 30-day project timeline.
    Input: task_name (string), start_day (int 1-30), duration_days (int).
    Returns valid/conflict/invalid status.
    """
    result = validate_timeline(task_name, start_day, duration_days)
    return json.dumps(result)


# ── Agent 1: Planner ───────────────────────────────────────
planner_agent = Agent(
    role="Marketing Task Planner",
    goal="Break down a high-level marketing goal into clear actionable subtasks with realistic cost, team, and timing estimates.",
    backstory="""You are a senior marketing strategist with 15 years of experience 
    planning campaigns for Fortune 500 companies. You excel at decomposing complex 
    marketing goals into structured executable task lists. You always consider 
    budget, team resources, and realistic timelines.""",
    llm=llm,
    verbose=True,
    allow_delegation=False,
    max_iter=3,
)

# ── Agent 2: Validator ─────────────────────────────────────
validator_agent = Agent(
    role="Resource Validator",
    goal="Validate each marketing task against budget, team availability, and timeline constraints using the available tools.",
    backstory="""You are a meticulous project manager who ensures every task is 
    feasible before it goes into the execution plan. You use validation tools to 
    check budget limits, confirm team availability, and verify timeline fit. 
    You flag any task that cannot proceed and explain exactly why.""",
    llm=llm,
    verbose=True,
    allow_delegation=False,
    max_iter=5,
    tools=[budget_checker_tool, team_availability_tool, timeline_validator_tool],
)

# ── Agent 3: Scheduler ─────────────────────────────────────
scheduler_agent = Agent(
    role="Execution Scheduler",
    goal="Take validated tasks and produce a clean ordered execution schedule with dependencies clearly identified in JSON format.",
    backstory="""You are an expert operations manager who specializes in creating 
    project execution timelines. You understand task dependencies, critical paths, 
    and resource optimization. You produce structured schedules that teams can 
    immediately act on. You always respond with valid JSON only.""",
    llm=llm,
    verbose=True,
    allow_delegation=False,
    max_iter=3,
)


# ── Task Definitions ───────────────────────────────────────

def create_planning_task(goal: str) -> Task:
    return Task(
        description=f"""
        Decompose the following marketing goal into 5-7 actionable subtasks:

        GOAL: {goal}

        For each subtask provide ALL of the following fields on separate lines:
        TASK: <short task name>
        DESC: <what needs to be done>
        COST: <estimated cost in USD as a plain number, e.g. 500>
        TEAM: <comma separated from: content_writer, seo_specialist, 
               social_media_mgr, graphic_designer, data_analyst, 
               email_marketer, campaign_manager>
        START: <start day number between 1 and 25>
        DURATION: <number of days, between 1 and 7>
        ---

        Rules:
        - Start days must be between 1 and 25
        - Durations must be between 1 and 7 days
        - Start day + duration must not exceed 30
        - Costs must be between 100 and 1200
        - Separate each task with ---
        """,
        expected_output="""A structured list of 5-7 marketing subtasks each 
        containing TASK, DESC, COST, TEAM, START, and DURATION fields 
        clearly labeled and separated by ---""",
        agent=planner_agent,
    )


def create_validation_task(planning_task: Task) -> Task:
    return Task(
        description="""
        Take the task list from the planner and validate each task using your tools.

        For EACH task you must call all three tools:
        1. budget_checker_tool(task_name, estimated_cost)
        2. team_availability_tool(task_name, team_members as comma-separated string)
        3. timeline_validator_tool(task_name, start_day, duration_days)

        After validating all tasks produce a report in this exact format:

        VALIDATION REPORT:
        TASK: <task name>
        BUDGET_STATUS: <approved or rejected>
        TEAM_STATUS: <available or unavailable>
        TIMELINE_STATUS: <valid or conflict or invalid>
        IS_VALID: <true or false>
        REASONS: <if not valid, list reasons separated by semicolons, else none>
        ---

        A task IS_VALID=true only if ALL THREE checks pass.
        Include every task from the planner in the report.
        """,
        expected_output="""A validation report for every task showing budget status,
        team status, timeline status, IS_VALID flag, and reasons if invalid.
        Each task separated by ---""",
        agent=validator_agent,
        context=[planning_task],
    )


def create_scheduling_task(planning_task: Task, validation_task: Task) -> Task:
    return Task(
        description="""
        Using the original task list and the validation report, create the final 
        execution schedule.

        Rules:
        1. Tasks with IS_VALID=true go in the timeline array
        2. Tasks with IS_VALID=false go in the flagged array  
        3. Sort timeline tasks by start_day ascending
        4. Detect dependencies: if task B's start_day >= task A's end_day, 
           add task A's name to task B's depends_on list
        5. end_day = start_day + duration_days

        You MUST respond with ONLY this JSON and absolutely nothing else 
        before or after it — no explanation, no markdown, no code block:

        {
          "timeline": [
            {
              "order": 1,
              "task_name": "string",
              "description": "string",
              "start_day": 1,
              "end_day": 4,
              "duration_days": 3,
              "team_members": ["content_writer"],
              "estimated_cost": 500,
              "depends_on": []
            }
          ],
          "flagged": [
            {
              "task_name": "string",
              "reasons": ["Budget insufficient"]
            }
          ],
          "summary": {
            "total_budget": 2500,
            "team_involved": ["content_writer", "data_analyst"],
            "project_duration": 20,
            "completion_rate": "5/6 tasks ready"
          }
        }
        """,
        expected_output="""Valid JSON only with timeline, flagged, and summary 
        fields. No text before or after the JSON.""",
        agent=scheduler_agent,
        context=[planning_task, validation_task],
    )


# ── Main Crew Runner ───────────────────────────────────────

def run_crew(goal: str, verbose: bool = True) -> dict:
    """
    Runs the full CrewAI pipeline for a given marketing goal.
    Returns a schedule dictionary compatible with the existing API.
    """
    if verbose:
        print(f"\n🎯 Goal: {goal}")
        print("🚀 Launching CrewAI agents...\n")

    # Create tasks
    planning_task   = create_planning_task(goal)
    validation_task = create_validation_task(planning_task)
    scheduling_task = create_scheduling_task(planning_task, validation_task)

    # Assemble crew
    crew = Crew(
        agents  = [planner_agent, validator_agent, scheduler_agent],
        tasks   = [planning_task, validation_task, scheduling_task],
        process = Process.sequential,
        verbose = verbose,
    )

    # Run
    result = crew.kickoff()

    # Extract raw output
    raw_output = ""
    if hasattr(result, 'raw'):
        raw_output = str(result.raw)
    elif hasattr(result, 'output'):
        raw_output = str(result.output)
    else:
        raw_output = str(result)

    if verbose:
        print(f"\n📄 Raw output:\n{raw_output}\n")

    # Parse JSON from output
    schedule_data = _parse_schedule(raw_output, verbose)

    # Add metadata
    schedule_data["generated_at"]  = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    schedule_data["total_tasks"]   = (
        len(schedule_data.get("timeline", [])) +
        len(schedule_data.get("flagged", []))
    )
    schedule_data["ready_count"]   = len(schedule_data.get("timeline", []))
    schedule_data["flagged_count"] = len(schedule_data.get("flagged", []))

    return schedule_data


def _parse_schedule(raw: str, verbose: bool = True) -> dict:
    """Try multiple strategies to extract JSON from the LLM output."""

    # Strategy 1 — find outermost { }
    try:
        start = raw.find('{')
        end   = raw.rfind('}') + 1
        if start != -1 and end > start:
            data = json.loads(raw[start:end])
            if "timeline" in data:
                return data
    except json.JSONDecodeError:
        pass

    # Strategy 2 — strip markdown code fences
    try:
        cleaned = raw.replace("```json", "").replace("```", "").strip()
        start   = cleaned.find('{')
        end     = cleaned.rfind('}') + 1
        if start != -1 and end > start:
            data = json.loads(cleaned[start:end])
            if "timeline" in data:
                return data
    except json.JSONDecodeError:
        pass

    # Strategy 3 — fallback empty schedule
    if verbose:
        print("⚠️  Could not parse JSON from crew output. Returning empty schedule.")

    return {
        "timeline": [],
        "flagged":  [],
        "summary": {
            "total_budget":     0,
            "team_involved":    [],
            "project_duration": 0,
            "completion_rate":  "0/0 tasks ready"
        }
    }


# ── Quick Test ─────────────────────────────────────────────
if __name__ == "__main__":
    result = run_crew("Analyze Competitor Ads", verbose=True)
    print("\n" + "="*60)
    print("FINAL SCHEDULE:")
    print(json.dumps(result, indent=2))