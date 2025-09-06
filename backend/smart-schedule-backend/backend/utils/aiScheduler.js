const axios = require('axios');

class AIScheduler {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiBaseUrl = 'https://api.openai.com/v1';
  }

  async generateTaskRecommendations(tasks, mood, availableTime, userPreferences) {
    try {
      const prompt = this.createTaskSchedulingPrompt(tasks, mood, availableTime, userPreferences);
      
      const response = await axios.post(
        `${this.openaiBaseUrl}`/chat/completions,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert productivity coach and scheduling assistant. You help users optimize their daily schedules based on their mood, energy levels, and task priorities."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': Bearer ` ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI scheduling error:', error);
      return this.fallbackScheduling(tasks, mood, availableTime);
    }
  }

  createTaskSchedulingPrompt(tasks, mood, availableTime, userPreferences) {
    const taskList = tasks.map(task => 
      - `${task.name} `(`${task.duration}min, ${task.priority} priority, ${task.category}`)
    ).join('\n');

    return `
Please help me create an optimal daily schedule based on the following information:

USER MOOD: ${mood}
AVAILABLE TIME: ${availableTime} minutes
USER PREFERENCES: ${JSON.stringify(userPreferences)}

TASKS TO SCHEDULE:
${taskList}

Please provide:
1. Recommended task order (considering mood and energy levels)
2. Suggested time slots for each task
3. Break recommendations between tasks
4. Mood-specific suggestions for task execution
5. Energy management tips

Format your response as JSON with this structure:
{
  "recommendedOrder": [taskId1, taskId2, ...],
  "timeSlots": [
    {
      "taskId": "taskId",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "room": "roomNumber",
      "energyLevel": "low/medium/high",
      "breakAfter": true/false
    }
  ],
  "suggestions": [
    "mood-specific suggestion 1",
    "mood-specific suggestion 2"
  ],
  "breakSchedule": [
    {
      "time": "HH:MM",
      "duration": 15,
      "activity": "suggested break activity"
    }
  ]
}
    `;
  }

  parseAIResponse(aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in AI response');
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  }

  fallbackScheduling(tasks, mood, availableTime) {
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
    
    const scoredTasks = tasks.map(task => ({
      ...task,
      score: this.calculateTaskScore(task, weights, mood)
    }));

    scoredTasks.sort((a, b) => b.score - a.score);

    return {
      recommendedOrder: scoredTasks.map(t => t._id),
      timeSlots: this.generateTimeSlots(scoredTasks, availableTime),
      suggestions: this.generateMoodSuggestions(mood),
      breakSchedule: this.generateBreakSchedule(scoredTasks, mood)
    };
  }

  calculateTaskScore(task, weights, mood) {
    const priorityScore = { high: 3, medium: 2, low: 1 }[task.priority];
    const energyScore = { high: 3, medium: 2, low: 1 }[task.estimatedEnergy];
    const moodWeight = weights[task.priority] || 1.0;
    
    return (priorityScore * 0.4 + energyScore * 0.3 + moodWeight * 0.3) * 100;
  }

  generateTimeSlots(tasks, availableTime) {
    const slots = [];
    let currentTime = 9 * 60;
    
    tasks.forEach((task, index) => {
      const startTime = this.formatTime(currentTime);
      const endTime = this.formatTime(currentTime + task.duration);
      
      slots.push({
        taskId: task._id,
        startTime,
        endTime,
        room: this.selectOptimalRoom(task, index),
        energyLevel: this.determineEnergyLevel(task, index),
        breakAfter: index < tasks.length - 1
      });
      
      currentTime += task.duration + 15;
    });
    
    return slots;
  }

  selectOptimalRoom(task, index) {
    const rooms = ['101', '102', '104', '105', '106', '201', '202', '206', '207'];
    return rooms[index % rooms.length];
  }

  determineEnergyLevel(task, index) {
    if (index === 0) return 'high';
    if (index < 3) return 'medium';
    return 'low';
  }

  generateMoodSuggestions(mood) {
    const suggestions = {
      'energetic': [
        'Tackle your most challenging tasks first while energy is high',
        'Consider adding a quick workout between tasks'
      ],
      'tired': [
        'Start with lighter, easier tasks to build momentum',
        'Take frequent short breaks to maintain focus'
      ],
      'stressed': [
        'Break large tasks into smaller, manageable chunks',
        'Schedule calming activities between demanding tasks'
      ],
      'focused': [
        'Perfect time for complex, detail-oriented work',
        'Minimize distractions and work in longer blocks'
      ],
      'anxious': [
        'Start with familiar, comfortable tasks',
        'Use breathing exercises during breaks'
      ]
    };
    
    return suggestions[mood] || ['Focus on one task at a time', 'Take breaks when needed'];
  }

  generateBreakSchedule(tasks, mood) {
    const breaks = [];
    let currentTime = 9 * 60;
    
    tasks.forEach((task, index) => {
      currentTime += task.duration;
      
      if (index < tasks.length - 1) {
        const breakActivity = this.getBreakActivity(mood, index);
        breaks.push({
          time: this.formatTime(currentTime),
          duration: 15,
          activity: breakActivity
        });
        currentTime += 15;
      }
    });
    
    return breaks;
  }

  getBreakActivity(mood, taskIndex) {
    const activities = {
      'energetic': ['Quick walk', 'Stretching', 'Deep breathing'],
      'tired': ['Power nap', 'Coffee break', 'Light stretching'],
      'stressed': ['Meditation', 'Deep breathing', 'Listen to music'],
      'focused': ['Eye rest', 'Hydration', 'Quick walk'],
      'anxious': ['Breathing exercise', 'Gentle stretching', 'Mindfulness']
    };
    
    const moodActivities = activities[mood] || ['Hydration', 'Stretching', 'Fresh air'];
    return moodActivities[taskIndex % moodActivities.length];
  }

  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

module.exports = new AIScheduler();