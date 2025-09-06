import apiService from './apiService';

class ScheduleService {
  async getSchedule(date) {
    try {
      const response = await apiService.get(/schedules/`${date}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get schedule error:', error);
      throw error;
    }
  }

  async generateSchedule(scheduleData) {
    try {
      const response = await apiService.post('/schedules/generate', scheduleData);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Generate schedule error:', error);
      throw error;
    }
  }

  async updateTaskStatus(scheduleId, taskId, isCompleted) {
    try {
      const response = await apiService.put(
        /schedules/`${scheduleId}`/tasks/`${taskId}`, 
        { isCompleted }
      );
      return response.success;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  }

  async generateAISchedule(scheduleData) {
    try {
      const response = await apiService.post('/ai/generate', scheduleData);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Generate AI schedule error:', error);
      throw error;
    }
  }

  async getAIInsights() {
    try {
      const response = await apiService.get('/ai/insights');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get AI insights error:', error);
      throw error;
    }
  }

  async getMoodInsights() {
    try {
      const response = await apiService.get('/ai/mood-insights');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get mood insights error:', error);
      throw error;
    }
  }
}

export default new ScheduleService();