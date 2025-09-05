import React, { useState, useEffect } from 'react';
import './App.css';
import TaskInput from './TaskInput.jsx';
import MoodSelector from './MoodSelector.jsx';
import ScheduleDisplay from './ScheduleDisplay.jsx';
import RoomAllocation from './RoomAllocation.jsx';

function App() {
  const [tasks, setTasks] = useState([]);
  const [mood, setMood] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([
    { id: 1, start: '09:00', end: '10:30', room: 'Room A' },
    { id: 2, start: '11:00', end: '12:30', room: 'Room B' },
    { id: 3, start: '14:00', end: '15:30', room: 'Room A' },
    { id: 4, start: '16:00', end: '17:30', room: 'Room C' },
    { id: 5, start: '18:00', end: '19:30', room: 'Room B' }
  ]);
  const [rooms, setRooms] = useState(['Room A', 'Room B', 'Room C']);

  // Generate schedule when tasks or mood changes
  useEffect(() => {
    if (tasks.length > 0) {
      generateSchedule();
    }
  }, [tasks, mood]);

  const generateSchedule = () => {
    // Simple scheduling algorithm
    const generatedSchedule = [];
    let slotIndex = 0;
    
    tasks.forEach((task, index) => {
      if (slotIndex < availableSlots.length) {
        const slot = availableSlots[slotIndex];
        generatedSchedule.push({
          id: index + 1,
          task: task.name,
          duration: task.duration,
          startTime: slot.start,
          endTime: slot.end,
          room: slot.room,
          priority: task.priority || 'medium'
        });
        slotIndex++;
      }
    });
    
    setSchedule(generatedSchedule);
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getMoodSuggestions = () => {
    const suggestions = {
      'stressed': 'Consider scheduling short breaks between tasks',
      'focused': 'Great time for complex tasks!',
      'tired': 'Schedule lighter tasks and take breaks',
      'energetic': 'Perfect for challenging tasks',
      'anxious': 'Try to schedule calming activities'
    };
    return suggestions[mood] || '';
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Daily Schedule Planner</h1>
        <p>Plan your day with mood-based optimization</p>
      </header>

      <div className="app-container">
        <div className="input-section">
          <MoodSelector mood={mood} setMood={setMood} />
          <TaskInput 
            addTask={addTask}
            tasks={tasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        </div>

        {mood && (
          <div className="mood-suggestions">
            <h3>💡 Mood-based Suggestion</h3>
            <p>{getMoodSuggestions()}</p>
          </div>
        )}

        <div className="schedule-section">
          <ScheduleDisplay 
            schedule={schedule}
            tasks={tasks}
            mood={mood}
          />
          <RoomAllocation 
            rooms={rooms}
            schedule={schedule}
            availableSlots={availableSlots}
          />
        </div>
      </div>
    </div>
  );
}

export default App;