const express = require('express');
const AIScheduler = require('../utils/aiScheduler');
const Task = require('../models/Task');
const Schedule = require('../models/Schedule');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');
const AIAnalysisService = require('../services/aiAnalysisService');

const router = express.Router();

router.use(auth);

router.post('/generate', async (req, res) => {
  try {
    const { date, mood, taskIds, userPreferences } = req.body;
    
    const tasks = await Task.find({
      _id: { $in: taskIds },
      userId: req.userId
    });

    if (tasks.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No tasks found' 
      });
    }

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const rooms = await Room.find({
      'availability.day': dayOfWeek,
      isActive: true
    });

    if (rooms.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No rooms available for this day' 
      });
    }

    const availableTime = rooms.reduce((total, room) => {
      const dayAvailability = room.availability.find(avail => avail.day === dayOfWeek);
      if (dayAvailability) {
        return total + dayAvailability.timeSlots.reduce((roomTotal, slot) => {
          const start = timeToMinutes(slot.start);
          const end = timeToMinutes(slot.end);
          return roomTotal + (end - start);
        }, 0);
      }
      return total;
    }, 0);

    const aiSchedule = await AIScheduler.generateTaskRecommendations(
      tasks, 
      mood, 
      availableTime, 
      userPreferences || {}
    );

    if (!aiSchedule) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to generate AI schedule' 
      });
    }

    const scheduleTasks = aiSchedule.timeSlots.map(slot => {
      const task = tasks.find(t => t._id.toString() === slot.taskId);
      return {
        taskId: task._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        room: slot.room,
        isCompleted: false,
        energyLevel: slot.energyLevel,
        breakAfter: slot.breakAfter
      };
    });

    const existingSchedule = await Schedule.findOne({
      userId: req.userId,
      date: new Date(date)
    });

    if (existingSchedule) {
      existingSchedule.mood = mood;
      existingSchedule.tasks = scheduleTasks;
      existingSchedule.suggestions = aiSchedule.suggestions;
      existingSchedule.breakSchedule = aiSchedule.breakSchedule;
      await existingSchedule.save();
      res.json({
        success: true,
        data: existingSchedule
      });
    } else {
      const schedule = new Schedule({
        userId: req.userId,
        date: new Date(date),
        mood,
        tasks: scheduleTasks,
        suggestions: aiSchedule.suggestions,
        breakSchedule: aiSchedule.breakSchedule
      });
      
      await schedule.save();
      res.status(201).json({
        success: true,
        data: schedule
      });
    }
  } catch (error) {
    console.error('AI schedule generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.get('/insights', async (req, res) => {
  try {
    const analysis = await AIAnalysisService.analyzeUserPatterns(req.userId);
    
    if (!analysis) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to analyze patterns' 
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Insights generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.get('/mood-insights', async (req, res) => {
  try {
    const insights = await AIAnalysisService.getMoodInsights(req.userId);
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Mood insights error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

module.exports = router;