const analyzeUserPatterns = (schedules) => {
  const moodProductivity = {};
  const hourlyProductivity = {};
  
  schedules.forEach(schedule => {
    // Analyze mood productivity
    const completedTasks = schedule.tasks.filter(task => task.isCompleted).length;
    const totalTasks = schedule.tasks.length;
    const productivity = totalTasks > 0 ? completedTasks / totalTasks : 0;
    
    if (!moodProductivity[schedule.mood]) {
      moodProductivity[schedule.mood] = { total: 0, count: 0 };
    }
    
    moodProductivity[schedule.mood].total += productivity;
    moodProductivity[schedule.mood].count += 1;

    // Analyze hourly productivity
    schedule.tasks.forEach(task => {
      const hour = parseInt(task.startTime.split(':')[0]);
      if (!hourlyProductivity[hour]) {
        hourlyProductivity[hour] = { completed: 0, total: 0 };
      }
      hourlyProductivity[hour].total += 1;
      if (task.isCompleted) {
        hourlyProductivity[hour].completed += 1;
      }
    });
  });

  const mostProductiveMoods = Object.entries(moodProductivity)
    .map(([mood, data]) => ({
      mood,
      averageProductivity: data.total / data.count
    }))
    .sort((a, b) => b.averageProductivity - a.averageProductivity);

  const peakHours = Object.entries(hourlyProductivity)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      productivity: data.total > 0 ? data.completed / data.total : 0
    }))
    .sort((a, b) => b.productivity - a.productivity);

  return {
    mostProductiveMoods,
    peakHours,
    totalSchedules: schedules.length
  };
};

const generatePersonalizedRecommendations = (analysis) => {
  const recommendations = [];
  
  if (analysis.mostProductiveMoods.length > 0) {
    const bestMood = analysis.mostProductiveMoods[0];
    recommendations.push(`You're most productive when feeling ${bestMood.mood}. Try to schedule important tasks during these times.`);
  }

  if (analysis.peakHours.length > 0) {
    const bestHour = analysis.peakHours[0];
    recommendations.push(`Your peak productivity hour is ${bestHour.hour}:00. Schedule your most important tasks during this time.`);
  }

  if (analysis.totalSchedules < 5) {
    recommendations.push("Keep using the app to get more personalized insights!");
  }

  return recommendations;
};

module.exports = {
  analyzeUserPatterns,
  generatePersonalizedRecommendations
};