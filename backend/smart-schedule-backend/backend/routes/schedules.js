const express = require('express');
const Schedule = require('../models/Schedule');
const Task = require('../models/Task');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');
const { generateSchedule } = require('../utils/scheduleGenerator');

const router = express.Router();

router.use(auth);

router.get('/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const schedule = await Schedule.findOne({
      userId: req.userId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    }).populate('tasks.taskId');

    if (!schedule) {
      return res.json({ 
        success: true,
        message: 'No schedule found for this date',
        data: null
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { date, mood, taskIds } = req.body;
    
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

    const generatedSchedule = generateSchedule(tasks, rooms, dayOfWeek, mood);

    const existingSchedule = await Schedule.findOne({
      userId: req.userId,
      date: new Date(date)
    });

    if (existingSchedule) {
      existingSchedule.mood = mood;
      existingSchedule.tasks = generatedSchedule.tasks;
      existingSchedule.suggestions = generatedSchedule.suggestions;
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
        tasks: generatedSchedule.tasks,
        suggestions: generatedSchedule.suggestions
      });
      
      await schedule.save();
      res.status(201).json({
        success: true,
        data: schedule
      });
    }
  } catch (error) {
    console.error('Generate schedule error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.put('/:scheduleId/tasks/:taskId', async (req, res) => {
  try {
    const { scheduleId, taskId } = req.params;
    const { isCompleted } = req.body;

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: req.userId
    });

    if (!schedule) {
      return res.status(404).json({ 
        success: false,
        message: 'Schedule not found' 
      });
    }

    const task = schedule.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found in schedule' 
      });
    }

    task.isCompleted = isCompleted;
    await schedule.save();

    res.json({ 
      success: true,
      message: 'Task status updated successfully' 
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;