const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateSchedule(tasks, mood, availableTime, userPreferences) {
    try {
      const prompt = this.createSchedulingPrompt(tasks, mood, availableTime, userPreferences);
      
      const response = await axios.post(
        `${this.baseURL}`/chat/completions,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert productivity coach and scheduling assistant."
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
            'Authorization': Bearer `${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  }

  createSchedulingPrompt(tasks, mood, availableTime, userPreferences) {
    const taskList = tasks.map(task => 
      - `${task.name}` (`${task.duration}min`,` ${task.priority} priority`, `${task.category}`)
    ).join('\n');

    return `
Create an optimal daily schedule based on:

USER MOOD: ${mood}
AVAILABLE TIME: ${availableTime} minutes
USER PREFERENCES: ${JSON.stringify(userPreferences)}

TASKS TO SCHEDULE:
${taskList}

Provide response as JSON:
{
  "recommendedOrder": [taskId1, taskId2, ...],
  "timeSlots": [
    {
      "taskId": "taskId",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "room": "roomNumber",
      "energyLevel": "low/medium/high"
    }
  ],
  "suggestions": ["suggestion1", "suggestion2"],
  "breakSchedule": [
    {
      "time": "HH:MM",
      "duration": 15,
      "activity": "break activity"
    }
  ]
}
    `;
  }

  parseResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found');
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  }
}

module.exports = new OpenAIService();