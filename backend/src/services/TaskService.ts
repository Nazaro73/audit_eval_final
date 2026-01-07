import taskRepository from "../repositories/TaskRepository";
import { TaskCreateDto, TaskFilters, TaskStatus } from "../models/Task";

export class TaskService {
  async getTasks(filters?: TaskFilters) {
    return await taskRepository.findAll(filters);
  }

  async getTaskById(id: number) {
    return await taskRepository.findById(id);
  }

  async createTask(task: TaskCreateDto) {
    return await taskRepository.create(task);
  }

  async updateTaskStatus(id: number, status: TaskStatus) {
    return await taskRepository.updateStatus(id, status);
  }

  async startTaskTimer(id: number) {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.timer_started_at) {
      throw new Error("Timer already running");
    }

    return await taskRepository.startTimer(id);
  }

  async stopTaskTimer(id: number) {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.timer_started_at) {
      throw new Error("Timer not running");
    }

    return await taskRepository.stopTimer(id);
  }
}

export default new TaskService();
