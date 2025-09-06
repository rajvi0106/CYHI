import apiService from './apiService';

class TaskService {
  async getTasks(params = {}) {
    try {
      const response = await apiService.get('/tasks', params);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const response = await apiService.post('/tasks', taskData);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  async updateTask(taskId, taskData) {
    try {
      const response = await apiService.put(/tasks/`${taskId}`, taskData);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await apiService.delete(/tasks/`${taskId}`);
      return response.success;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }
}

export default new TaskService();