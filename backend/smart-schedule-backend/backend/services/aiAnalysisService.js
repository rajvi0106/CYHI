const Schedule = require('../models/Schedule');
const { analyzeUserPatterns, generatePersonalizedRecommendations } = require('../utils/aiHelpers');

class AIAnalysisService {
  async analyzeUserPatterns(userId, timeRange = 30) {
    try {
      const schedules = await Schedule.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000) }
      }).populate('tasks.taskId');

      const analysis = analyzeUserPatterns(schedules);
      const recommendations = generatePersonalizedRecommendations(analysis);

      return {
        ...analysis,
        recommendations
      };
    } catch (error) {
      console.error('Pattern analysis error:', error);
      return null;
    }
  }

  async getMoodInsights(userId) {
    try {
      const schedules = await Schedule.find({ userId }).sort({ createdAt: -1 }).limit(30);
      
      const moodStats = {};
      schedules.forEach(schedule => {
        if (!moodStats[schedule.mood]) {
          moodStats[schedule.mood] = { count: 0, totalTasks: 0, completedTasks: 0 };
        }
        moodStats[schedule.mood].count += 1;
        moodStats[schedule.mood].totalTasks += schedule.tasks.length;
        moodStats[schedule.mood].completedTasks += schedule.tasks.filter(t => t.isCompleted).length;
      });

      return Object.entries(moodStats).map(([mood, stats]) => ({
        mood,
        frequency: stats.count,
        completionRate: stats.totalTasks > 0 ? stats.completedTasks / stats.totalTasks : 0
      }));
    } catch (error) {
      console.error('Mood insights error:', error);
      return [];
    }
  }
}

module.exports = new AIAnalysisService();