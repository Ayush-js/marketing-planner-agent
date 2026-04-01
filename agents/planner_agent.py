# agents/planner_agent.py

from dotenv import load_dotenv
import os
from groq import Groq

# Import our 3 mock tools
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.budget_checker import check_budget
from tools.team_availability import check_team_availability
from tools.timeline_validator import validate_timeline

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# ── System prompt ──────────────────────────────────────────────
SYSTEM_PROMPT = """
You are a Marketing Planning Agent. Your job is to take a high-level 
marketing goal and break it down into clear, actionable subtasks.

For each subtask you identify, you must specify:
1. task_name     : short name of the task
2. description   : what needs to be done
3. estimated_cost: estimated budget in USD (a number)
4. team_members  : list of team members needed (choose from: 
                   content_writer, seo_specialist, social_media_mgr,
                   graphic_designer, data_analyst, email_marketer, 
                   campaign_manager)
5. start_day     : which day of the project it starts (1-30)
6. duration_days : how many days it will take

Always respond in this exact format for each task:
TASK: <task_name>
DESC: <description>
COST: <number>
TEAM: <member1>, <member2>
START: <day number>
DURATION: <number of days>
---
"""

def parse_tasks(response_text: str) -> list:
    """Parse the LLM response into structured task dictionaries."""
    tasks = []
    current_task = {}

    for line in response_text.split("\n"):
        line = line.strip()
        if not line:
            continue

        if line.startswith("TASK:"):
            # Save previous task if exists
            if "task_name" in current_task:
                tasks.append(current_task)
            # Start new task
            current_task = {"task_name": line.replace("TASK:", "").strip()}

        elif line.startswith("DESC:"):
            current_task["description"] = line.replace("DESC:", "").strip()

        elif line.startswith("COST:"):
            try:
                current_task["estimated_cost"] = float(line.replace("COST:", "").strip())
            except:
                current_task["estimated_cost"] = 0.0

        elif line.startswith("TEAM:"):
            members = line.replace("TEAM:", "").strip()
            current_task["team_members"] = [m.strip() for m in members.split(",")]

        elif line.startswith("START:"):
            try:
                current_task["start_day"] = int(line.replace("START:", "").strip())
            except:
                current_task["start_day"] = 1

        elif line.startswith("DURATION:"):
            try:
                current_task["duration_days"] = int(line.replace("DURATION:", "").strip())
            except:
                current_task["duration_days"] = 1

    # Don't forget the last task
    if "task_name" in current_task:
        tasks.append(current_task)

    return tasks


def validate_tasks(tasks: list) -> list:
    """Run each task through all 3 mock tools and collect results."""
    validated = []

    for task in tasks:
        print(f"\n🔍 Validating: {task['task_name']}")

        # Tool 1 — Budget check
        budget_result = check_budget(
            task["task_name"],
            task.get("estimated_cost", 0)
        )
        print(f"   💰 {budget_result['message']}")

        # Tool 2 — Team availability
        team_result = check_team_availability(
            task["task_name"],
            task.get("team_members", [])
        )
        print(f"   👥 {team_result['summary']}")

        # Tool 3 — Timeline validation
        timeline_result = validate_timeline(
            task["task_name"],
            task.get("start_day", 1),
            task.get("duration_days", 1)
        )
        print(f"   📅 {timeline_result['message']}")

        # Overall status
        is_valid = (
            budget_result["status"]   == "approved" and
            team_result["all_available"]             and
            timeline_result["status"] == "valid"
        )

        validated.append({
            "task"            : task,
            "budget_result"   : budget_result,
            "team_result"     : team_result,
            "timeline_result" : timeline_result,
            "is_valid"        : is_valid,
            "overall_status"  : "✅ Ready" if is_valid else "⚠️ Needs Attention"
        })

    return validated


def run_planner_agent(goal: str) -> list:
    """Main agent function — takes a goal and returns validated tasks."""

    print(f"\n🎯 Goal received: {goal}")
    print("🤖 Agent is thinking...\n")

    # Call Groq LLM to decompose the goal
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": f"Break down this marketing goal into subtasks: {goal}"}
        ],
        model="llama-3.3-70b-versatile",
    )

    raw_response = response.choices[0].message.content
    print("📋 Tasks identified by Agent:")
    print(raw_response)
    print("\n" + "="*50)

    # Parse and validate tasks
    tasks = parse_tasks(raw_response)
    print(f"\n✅ {len(tasks)} tasks parsed successfully")

    validated_tasks = validate_tasks(tasks)

    return validated_tasks


# Quick test
if __name__ == "__main__":
    results = run_planner_agent("Analyze Competitor Ads")

    print("\n" + "="*50)
    print("📊 VALIDATION SUMMARY")
    print("="*50)
    for r in results:
        print(f"  {r['overall_status']} — {r['task']['task_name']}")