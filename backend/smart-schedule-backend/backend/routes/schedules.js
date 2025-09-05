const express = require('express');
const Schedule = require('../models/schedule');
const Task = require('../models/Task');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const { generateSchedule } = require('../utils/scheduleGenerator');

const router = express.Router();

// Get schedule for a specific date
router.get('/:date', auth, async (req, res) => {
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
      return res.json({ message: 'No schedule found for this date' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new schedule
router.post('/generate', auth, async (req, res) => {
  try {
    const { date, mood, taskIds } = req.body;
    
    // Get tasks
    const tasks = await Task.find({
      _id: { $in: taskIds },
      userId: req.userId
    });

    if (tasks.length === 0) {
      return res.status(400).json({ message: 'No tasks found' });
    }

    // Get available rooms for the day
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const rooms = await Room.find({
      'availability.day': dayOfWeek,
      isActive: true
    });

    if (rooms.length === 0) {
      return res.status(400).json({ message: 'No rooms available for this day' });
    }

    // Generate schedule
    const generatedSchedule = generateSchedule(tasks, rooms, dayOfWeek, mood);

    // Save or update schedule
    const existingSchedule = await Schedule.findOne({
      userId: req.userId,
      date: new Date(date)
    });

    if (existingSchedule) {
      existingSchedule.mood = mood;
      existingSchedule.tasks = generatedSchedule.tasks;
      existingSchedule.suggestions = generatedSchedule.suggestions;
      await existingSchedule.save();
      res.json(existingSchedule);
    } else {
      const schedule = new Schedule({
        userId: req.userId,
        date: new Date(date),
        mood,
        tasks: generatedSchedule.tasks,
        suggestions: generatedSchedule.suggestions
      });
      
      await schedule.save();
      res.status(201).json(schedule);
    }
  } catch (error) {
    console.error('Generate schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task completion status
router.put('/:scheduleId/tasks/:taskId', auth, async (req, res) => {
  try {
    const { scheduleId, taskId } = req.params;
    const { isCompleted } = req.body;

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: req.userId
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const task = schedule.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found in schedule' });
    }

    task.isCompleted = isCompleted;
    await schedule.save();

    res.json({ message: 'Task status updated successfully' });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;