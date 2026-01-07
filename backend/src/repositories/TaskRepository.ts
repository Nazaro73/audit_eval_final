import pool from "../config/database";
import { Task, TaskCreateDto, TaskFilters, TaskStatus } from "../models/Task";

export class TaskRepository {
  async findAll(filters?: TaskFilters): Promise<Task[]> {
    let query = "SELECT * FROM tasks WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.search) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number): Promise<Task | null> {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  async create(task: TaskCreateDto): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, name, description, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [task.user_id, task.name, task.description || "", task.status || "todo"]
    );
    return result.rows[0];
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task | null> {
    const result = await pool.query(
      "UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );
    return result.rows[0] || null;
  }

  async startTimer(id: number): Promise<Task | null> {
    const result = await pool.query(
      "UPDATE tasks SET timer_started_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }

  async stopTimer(id: number): Promise<Task | null> {
    const result = await pool.query(
      `UPDATE tasks 
       SET time_logged = time_logged + EXTRACT(EPOCH FROM (NOW() - timer_started_at))::INTEGER,
           timer_started_at = NULL,
           updated_at = NOW()
       WHERE id = $1 AND timer_started_at IS NOT NULL
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  async countByStatus(status: TaskStatus): Promise<number> {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM tasks WHERE status = $1",
      [status]
    );
    return parseInt(result.rows[0].count);
  }

  async getTotalTimeLogged(): Promise<number> {
    const result = await pool.query(
      "SELECT SUM(time_logged) as total FROM tasks"
    );
    return parseInt(result.rows[0].total || "0");
  }
}

export default new TaskRepository();
