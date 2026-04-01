# utils/scheduler.py

from datetime import datetime, timedelta

def generate_schedule(validated_tasks: list) -> dict:
    """
    Takes validated tasks from the planner agent and generates
    a detailed execution schedule with dependencies handled.
    """

    print("\n" + "="*50)
    print("📅 GENERATING EXECUTION SCHEDULE")
    print("="*50)

    # Separate ready and flagged tasks
    ready_tasks     = [t for t in validated_tasks if t["is_valid"]]
    flagged_tasks   = [t for t in validated_tasks if not t["is_valid"]]

    # Sort ready tasks by start day
    ready_tasks.sort(key=lambda x: x["task"]["start_day"])

    # Build schedule
    schedule = {
        "generated_at"  : datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_tasks"   : len(validated_tasks),
        "ready_count"   : len(ready_tasks),
        "flagged_count" : len(flagged_tasks),
        "timeline"      : [],
        "flagged"       : [],
        "summary"       : {}
    }

    # Process ready tasks
    print(f"\n✅ SCHEDULED TASKS ({len(ready_tasks)})")
    print("-" * 50)

    total_budget = 0
    all_members  = set()

    for i, item in enumerate(ready_tasks, 1):
        task        = item["task"]
        start_day   = task["start_day"]
        end_day     = start_day + task["duration_days"]
        cost        = task.get("estimated_cost", 0)
        members     = task.get("team_members", [])

        total_budget += cost
        all_members.update(members)

        # Build timeline entry
        entry = {
            "order"         : i,
            "task_name"     : task["task_name"],
            "description"   : task.get("description", ""),
            "start_day"     : start_day,
            "end_day"       : end_day,
            "duration_days" : task["duration_days"],
            "team_members"  : members,
            "estimated_cost": cost,
            "depends_on"    : []
        }

        # Simple dependency check — if task starts after another ends
        for prev in schedule["timeline"]:
            if prev["end_day"] <= start_day:
                entry["depends_on"].append(prev["task_name"])

        schedule["timeline"].append(entry)

        # Print formatted schedule entry
        print(f"\n  [{i}] {task['task_name']}")
        print(f"      📆 Day {start_day} → Day {end_day} ({task['duration_days']} days)")
        print(f"      💰 Budget  : ${cost}")
        print(f"      👥 Team    : {', '.join(members)}")
        if entry["depends_on"]:
            print(f"      🔗 Depends : {', '.join(entry['depends_on'])}")

    # Process flagged tasks
    if flagged_tasks:
        print(f"\n⚠️  FLAGGED TASKS ({len(flagged_tasks)}) — Need Attention")
        print("-" * 50)

        for item in flagged_tasks:
            task = item["task"]
            reasons = []

            if item["budget_result"]["status"] != "approved":
                reasons.append("Budget insufficient")
            if not item["team_result"]["all_available"]:
                reasons.append("Team unavailable")
            if item["timeline_result"]["status"] != "valid":
                reasons.append("Timeline conflict")

            flagged_entry = {
                "task_name" : task["task_name"],
                "reasons"   : reasons
            }
            schedule["flagged"].append(flagged_entry)

            print(f"\n  ⚠️  {task['task_name']}")
            for reason in reasons:
                print(f"      ❌ {reason}")

    # Build summary
    schedule["summary"] = {
        "total_budget"    : total_budget,
        "team_involved"   : list(all_members),
        "project_duration": max(
            (t["end_day"] for t in schedule["timeline"]),
            default=0
        ),
        "completion_rate" : f"{len(ready_tasks)}/{len(validated_tasks)} tasks ready"
    }

    # Print summary
    print("\n" + "="*50)
    print("📊 SCHEDULE SUMMARY")
    print("="*50)
    print(f"  ✅ Tasks Ready     : {len(ready_tasks)}/{len(validated_tasks)}")
    print(f"  💰 Total Budget    : ${total_budget}")
    print(f"  👥 Team Involved   : {', '.join(all_members)}")
    print(f"  📆 Project Duration: {schedule['summary']['project_duration']} days")
    print(f"  🕐 Generated At    : {schedule['generated_at']}")

    return schedule


# Quick test
if __name__ == "__main__":
    # Mock validated tasks to test scheduler independently
    mock_tasks = [
        {
            "is_valid" : True,
            "task" : {
                "task_name"     : "Competitor Research",
                "description"   : "Research competitor ads",
                "estimated_cost": 300,
                "team_members"  : ["content_writer", "seo_specialist"],
                "start_day"     : 23,
                "duration_days" : 3
            },
            "budget_result"  : {"status": "approved",  "message": "✅ Approved"},
            "team_result"    : {"all_available": True,  "summary": "✅ All available"},
            "timeline_result": {"status": "valid",      "message": "✅ Valid"}
        },
        {
            "is_valid" : False,
            "task" : {
                "task_name"     : "Ad Copy Writing",
                "description"   : "Write ad copy",
                "estimated_cost": 800,
                "team_members"  : ["social_media_mgr"],
                "start_day"     : 7,
                "duration_days" : 3
            },
            "budget_result"  : {"status": "rejected",  "message": "❌ Rejected"},
            "team_result"    : {"all_available": False, "summary": "⚠️ Unavailable"},
            "timeline_result": {"status": "conflict",  "message": "⚠️ Conflict"}
        }
    ]

    generate_schedule(mock_tasks)