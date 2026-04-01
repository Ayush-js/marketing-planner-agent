# tools/team_availability.py

def check_team_availability(task_name: str, required_members: list) -> dict:
    """
    Mock tool that checks if team members are available for a task.
    In a real system, this would query an HR or calendar API.
    """

    # Mock team availability data
    team_schedule = {
        "content_writer"    : {"available": True,  "current_task": None},
        "seo_specialist"    : {"available": True,  "current_task": None},
        "social_media_mgr"  : {"available": False, "current_task": "Instagram Campaign"},
        "graphic_designer"  : {"available": True,  "current_task": None},
        "data_analyst"      : {"available": False, "current_task": "Q1 Report"},
        "email_marketer"    : {"available": True,  "current_task": None},
        "campaign_manager"  : {"available": True,  "current_task": None},
    }

    results = {}
    all_available = True

    for member in required_members:
        member_key = member.lower().replace(" ", "_")

        if member_key in team_schedule:
            info = team_schedule[member_key]
            if info["available"]:
                results[member] = {
                    "status"  : "available",
                    "message" : f"✅ {member} is available for '{task_name}'"
                }
            else:
                all_available = False
                results[member] = {
                    "status"  : "busy",
                    "message" : f"❌ {member} is busy with '{info['current_task']}'"
                }
        else:
            all_available = False
            results[member] = {
                "status"  : "not_found",
                "message" : f"⚠️ {member} not found in the system"
            }

    return {
        "task"          : task_name,
        "team_results"  : results,
        "all_available" : all_available,
        "summary"       : "✅ All members available" if all_available else "⚠️ Some members are unavailable"
    }


# Quick test
if __name__ == "__main__":
    # Test 1 - all available
    result1 = check_team_availability(
        "Competitor Ad Research",
        ["content_writer", "data_analyst"]
    )
    print("Test 1:")
    print(f"  Summary : {result1['summary']}")
    for member, info in result1["team_results"].items():
        print(f"  {info['message']}")

    print()

    # Test 2 - mixed availability
    result2 = check_team_availability(
        "Social Media Campaign",
        ["social_media_mgr", "graphic_designer"]
    )
    print("Test 2:")
    print(f"  Summary : {result2['summary']}")
    for member, info in result2["team_results"].items():
        print(f"  {info['message']}")