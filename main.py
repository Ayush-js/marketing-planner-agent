# main.py — Marketing Planner Agent Entry Point

import sys
import os
from dotenv import load_dotenv

load_dotenv()

# Import agent and scheduler
from agents.planner_agent import run_planner_agent
from utils.scheduler import generate_schedule

def print_banner():
    print("""
╔══════════════════════════════════════════════════╗
║       🤖 MARKETING PLANNER AGENT                ║
║       Powered by LLaMA 3.3 + Groq               ║
╚══════════════════════════════════════════════════╝
    """)

def print_final_report(schedule: dict):
    """Print a clean final report of the execution plan."""

    print("\n" + "═"*50)
    print("📋 FINAL EXECUTION PLAN")
    print("═"*50)

    if not schedule["timeline"]:
        print("  ⚠️  No tasks could be scheduled. Please review flagged tasks.")
        return

    print(f"\n  📌 Total Tasks   : {schedule['total_tasks']}")
    print(f"  ✅ Scheduled     : {schedule['ready_count']}")
    print(f"  ⚠️  Flagged       : {schedule['flagged_count']}")
    print(f"  💰 Total Budget  : ${schedule['summary']['total_budget']}")
    print(f"  📆 Duration      : {schedule['summary']['project_duration']} days")
    print(f"  👥 Team          : {', '.join(schedule['summary']['team_involved'])}")

    print("\n  📅 EXECUTION ORDER:")
    print("  " + "-"*44)

    for task in schedule["timeline"]:
        print(f"\n  Step {task['order']}: {task['task_name']}")
        print(f"    📆 Day {task['start_day']} → Day {task['end_day']}")
        print(f"    💰 ${task['estimated_cost']}")
        print(f"    👥 {', '.join(task['team_members'])}")
        print(f"    📝 {task['description'][:80]}...")
        if task["depends_on"]:
            print(f"    🔗 After: {', '.join(task['depends_on'])}")

    if schedule["flagged"]:
        print("\n  ⚠️  FLAGGED — NEED ATTENTION:")
        print("  " + "-"*44)
        for item in schedule["flagged"]:
            print(f"\n  ❌ {item['task_name']}")
            for reason in item["reasons"]:
                print(f"     • {reason}")

    print("\n" + "═"*50)
    print("✅ Plan generation complete!")
    print("═"*50)


def main():
    print_banner()

    # ── Get goal from user ──────────────────────────
    print("💡 Example goals:")
    print("   • Analyze Competitor Ads")
    print("   • Launch a Social Media Campaign")
    print("   • Plan an Email Marketing Strategy")
    print("   • Run an SEO Optimization Project")
    print()

    goal = input("🎯 Enter your marketing goal: ").strip()

    if not goal:
        print("❌ No goal entered. Exiting.")
        sys.exit(1)

    print("\n" + "="*50)

    # ── Step 1: Run Planner Agent ───────────────────
    validated_tasks = run_planner_agent(goal)

    # ── Step 2: Generate Schedule ───────────────────
    schedule = generate_schedule(validated_tasks)

    # ── Step 3: Print Final Report ──────────────────
    print_final_report(schedule)


if __name__ == "__main__":
    main()