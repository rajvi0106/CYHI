export const analyzeTaskPatterns = (tasks) => {
  const patterns = {
    mostCommonCategory: null,
    averageDuration: 0,
    priorityDistribution: { high: 0, medium: 0, low: 0 },
    completionRate: 0
  };

  if (tasks.length === 0) return patterns;

  // Most common category
  const categoryCount = {};
  tasks.forEach(task => {
    categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
  });
  patterns.mostCommonCategory = Object.keys(categoryCount).reduce((a, b) => 
    categoryCount[a] > categoryCount[b] ? a : b
  );

  // Average duration
  patterns.averageDuration = tasks.reduce((sum, task) => sum + task.duration, 0) / tasks.length;

  // Priority distribution
  tasks.forEach(task => {
    patterns.priorityDistribution[task.priority]++;
  });

  // Completion rate
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  patterns.completionRate = completedTasks / tasks.length;

  return patterns;
};

export const generateMoodInsights = (schedules) => {
  const moodStats = {};
  
  schedules.forEach(schedule => {
    if (!moodStats[schedule.mood]) {
      moodStats[schedule.mood] = {
        count: 0,
        totalTasks: 0,
        completedTasks: 0,
        averageProductivity: 0
      };
    }
    
    moodStats[schedule.mood].count++;
    moodStats[schedule.mood].totalTasks += schedule.tasks.length;
    moodStats[schedule.mood].completedTasks += schedule.tasks.filter(t => t.isCompleted).length;
  });

  // Calculate average productivity for each mood
  Object.keys(moodStats).forEach(mood => {
    const stats = moodStats[mood];
    stats.averageProductivity = stats.totalTasks > 0 ? stats.completedTasks / stats.totalTasks : 0;
  });

  return Object.entries(moodStats).map(([mood, stats]) => ({
    mood,
    frequency: stats.count,
    completionRate: stats.averageProductivity,
    totalTasks: stats.totalTasks
  }));
};

export const getOptimalTaskOrder = (tasks, mood) => {
  const moodWeights = {
    'energetic': { high: 1.2, medium: 1.0, low: 0.8 },
    'focused': { high: 1.1, medium: 1.0, low: 0.9 },
    'tired': { high: 0.7, medium: 0.8, low: 1.1 },
    'stressed': { high: 0.6, medium: 0.9, low: 1.2 },
    'happy': { high: 1.0, medium: 1.0, low: 1.0 },
    'anxious': { high: 0.5, medium: 0.8, low: 1.3 },
    'calm': { high: 0.9, medium: 1.1, low: 1.0 },
    'motivated': { high: 1.3, medium: 1.0, low: 0.7 }
  };

  const weights = moodWeights[mood] || moodWeights['focused'];
  
  return tasks
    .map(task => ({
      ...task,
      score: calculateTaskScore(task, weights)
    }))
    .sort((a, b) => b.score - a.score);
};

const calculateTaskScore = (task, weights) => {
  const priorityScore = { high: 3, medium: 2, low: 1 }[task.priority];
  const energyScore = { high: 3, medium: 2, low: 1 }[task.estimatedEnergy];
  const moodWeight = weights[task.priority] || 1.0;
  
  return (priorityScore * 0.4 + energyScore * 0.3 + moodWeight * 0.3) * 100;
};

export const generateBreakSuggestions = (mood, taskCount) => {
  const suggestions = {
    'energetic': [
      'Take a quick walk to maintain energy',
      'Do some light stretching',
      'Hydrate and have a healthy snack'
    ],
    'tired': [
      'Take a power nap (15-20 minutes)',
      'Have a coffee or tea break',
      'Do gentle stretching or breathing exercises'
    ],
    'stressed': [
      'Practice deep breathing for 5 minutes',
      'Listen to calming music',
      'Take a short walk in nature'
    ],
    'focused': [
      'Rest your eyes for a few minutes',
      'Hydrate and have a light snack',
      'Do some light stretching'
    ],
    'anxious': [
      'Practice mindfulness or meditation',
      'Do breathing exercises',
      'Take a short walk to clear your mind'
    ]
  };

  const moodSuggestions = suggestions[mood] || suggestions['focused'];
  return moodSuggestions.slice(0, Math.min(taskCount, moodSuggestions.length));
};

export const calculateProductivityScore = (schedule) => {
  if (!schedule || !schedule.tasks || schedule.tasks.length === 0) return 0;
  
  const completedTasks = schedule.tasks.filter(task => task.isCompleted).length;
  const totalTasks = schedule.tasks.length;
  const completionRate = completedTasks / totalTasks;
  
  // Bonus for high-priority tasks completed
  const highPriorityCompleted = schedule.tasks.filter(
    task => task.isCompleted && task.priority === 'high'
  ).length;
  const highPriorityTotal = schedule.tasks.filter(
    task => task.priority === 'high'
  ).length;
  
  const highPriorityBonus = highPriorityTotal > 0 ? 
    (highPriorityCompleted / highPriorityTotal) * 0.2 : 0;
  
  return Math.min(100, (completionRate + highPriorityBonus) * 100);
};