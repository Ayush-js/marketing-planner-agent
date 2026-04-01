# tools/budget_checker.py

def check_budget(task_name: str, estimated_cost: float) -> dict:
    """
    Mock tool that checks if budget is available for a given task.
    In a real system, this would query a finance API or database.
    """

    # Mock budget data
    available_budgets = {
    "competitor_ad_research"            : 1000.00,
    "ad_creative_analysis"              : 600.00,
    "ad_targeting_analysis"             : 500.00,
    "ad_performance_analysis"           : 700.00,
    "competitor_ad_insights_report"     : 1200.00,
    "competitor_ad_strategy_development": 1500.00,
    "ad_creative_brief_development"     : 900.00,
    "social_media_campaign"             : 800.00,
    "email_marketing"                   : 200.00,
    "seo_optimization"                  : 400.00,
    "default"                           : 1000.00  # ← increased from 250
}

    # Get available budget for the task
    task_key = task_name.lower().replace(" ", "_")
    available = available_budgets.get(task_key, available_budgets["default"])

    # Check if budget is sufficient
    if estimated_cost <= available:
        status = "approved"
        message = f"✅ Budget approved for '{task_name}': ${estimated_cost} (Available: ${available})"
    else:
        status = "rejected"
        message = f"❌ Budget insufficient for '{task_name}': ${estimated_cost} needed but only ${available} available"

    return {
        "task"           : task_name,
        "estimated_cost" : estimated_cost,
        "available"      : available,
        "status"         : status,
        "message"        : message
    }


# Quick test
if __name__ == "__main__":
    print(check_budget("competitor_research", 300))
    print(check_budget("ad_copy_creation", 500))