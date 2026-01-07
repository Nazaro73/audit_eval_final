export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: number;
  user_id: number;
  name: string;
  description: string;
  status: TaskStatus;
  time_logged: number;
  timer_started_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface TaskCreateDto {
  user_id: number;
  name: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskUpdateStatusDto {
  status: TaskStatus;
}

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
}
