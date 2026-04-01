# tools/timeline_validator.py

def validate_timeline(task_name: str, start_day: int, duration_days: int) -> dict:
    """
    Mock tool that validates if a task fits within the project timeline.
    In a real system, this would query a project management tool like Jira or Asana.
    """

    # Mock project constraints
    PROJECT_START_DAY = 1
    PROJECT_END_DAY   = 30  # 30 day marketing sprint

    # Mock already scheduled tasks (day_start, day_end)
    scheduled_tasks = {
        "Market Research"       : (1,  5),
        "Brand Strategy"        : (3,  7),
        "Content Planning"      : (6,  10),
        "Ad Copy Writing"       : (8,  14),
        "Campaign Setup"        : (12, 18),
        "Review & Approval"     : (18, 22),
    }

    task_end_day = start_day + duration_days

    # Check 1 — fits within project timeline
    if start_day < PROJECT_START_DAY:
        return {
            "task"    : task_name,
            "status"  : "invalid",
            "message" : f"❌ Start day {start_day} is before project start (Day {PROJECT_START_DAY})"
        }

    if task_end_day > PROJECT_END_DAY:
        return {
            "task"    : task_name,
            "status"  : "invalid",
            "message" : f"❌ Task ends on Day {task_end_day} which exceeds project deadline (Day {PROJECT_END_DAY})"
        }

    # Check 2 — no conflicts with existing tasks
    conflicts = []
    for existing_task, (ex_start, ex_end) in scheduled_tasks.items():
        # Check overlap
        if not (task_end_day <= ex_start or start_day >= ex_end):
            conflicts.append(f"{existing_task} (Day {ex_start}-{ex_end})")

    if conflicts:
        return {
            "task"      : task_name,
            "status"    : "conflict",
            "start_day" : start_day,
            "end_day"   : task_end_day,
            "message"   : f"⚠️ '{task_name}' conflicts with: {', '.join(conflicts)}"
        }

    # All checks passed
    return {
        "task"      : task_name,
        "status"    : "valid",
        "start_day" : start_day,
        "end_day"   : task_end_day,
        "message"   : f"✅ '{task_name}' scheduled for Day {start_day} to Day {task_end_day} — No conflicts!"
    }


# Quick test
if __name__ == "__main__":
    print("Test 1 — Valid slot:")
    print(validate_timeline("Competitor Ad Analysis", 23, 4))

    print("\nTest 2 — Conflict with existing task:")
    print(validate_timeline("Social Media Audit", 7, 3))

    print("\nTest 3 — Exceeds project deadline:")
    print(validate_timeline("Final Report", 28, 5))