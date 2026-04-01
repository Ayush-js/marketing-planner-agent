export interface ScheduleTask {
  order: number;
  task_name: string;
  description: string;
  start_day: number;
  end_day: number;
  duration_days: number;
  team_members: string[];
  estimated_cost: number;
  depends_on: string[];
}

export interface FlaggedTask {
  task_name: string;
  reasons: string[];
}

export interface PlanSchedule {
  generated_at: string;
  total_tasks: number;
  ready_count: number;
  flagged_count: number;
  timeline: ScheduleTask[];
  flagged: FlaggedTask[];
  summary: {
    total_budget: number;
    team_involved: string[];
    project_duration: number;
    completion_rate: string;
  };
}
