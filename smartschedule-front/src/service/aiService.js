import apiService from './apiService';

class AIService {
  async generateTaskRecommendations(tasks, mood, availableTime, userPreferences) {
    try {
      const response = await apiService.post('/ai/generate', {
        tasks,
        mood,
        availableTime,
        userPreferences
      });
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Generate AI recommendations error:', error);
      throw error;
    }
  }

  async getPersonalizedInsights() {
    try {
      const response = await apiService.get('/ai/insights');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get AI insights error:', error);
      throw error;
    }
  }

  async analyzeMoodPatterns() {
    try {
      const response = await apiService.get('/ai/mood-insights');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Analyze mood patterns error:', error);
      throw error;
    }
  }
}

export default new AIService();