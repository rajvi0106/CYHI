import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAI } from '../../hooks/useAI';
import Navbar from './Navbar';
import TaskInput from '../schedule/TaskInput';
import MoodSelector from '../schedule/MoodSelector';
import ScheduleDisplay from '../schedule/ScheduleDisplay';
import RoomAllocation from '../schedule/RoomAllocation';
import AIScheduleGenerator from "../../ai/AIScheduleGenerator";
import AIInsights from '../../ai/AIInsights';
import MoodAnalysis from "../../ai/MoodAnalysis";
import TaskRecommendations from '../../ai/TaskRecommendations';
import taskService from '../../service/taskService';
import scheduleService from '../../service/scheduleService';
import { getGreeting } from '../../utils/helper';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { insights, loadInsights, loadMoodAnalysis } = useAI();
  
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [mood, setMood] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    loadUserData();
    loadTodaySchedule();
  }, []);

  useEffect(() => {
    if (mood) {
      loadInsights();
      loadMoodAnalysis();
    }
  }, [mood]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      if (data) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodaySchedule = async () => {
    try {
      const data = await scheduleService.getSchedule(selectedDate);
      if (data) {
        setSchedule(data);
        setMood(data.mood || '');
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      if (newTask) {
        setTasks(prev => [newTask, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const updated = await taskService.updateTask(taskId, updatedTask);
      if (updated) {
        setTasks(prev => prev.map(task => 
          task._id === taskId ? updated : task
        ));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const success = await taskService.deleteTask(taskId);
      if (success) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleGenerateSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      const newSchedule = await scheduleService.generateSchedule(scheduleData);
      if (newSchedule) {
        setSchedule(newSchedule);
        setMood(newSchedule.mood);
      }
    } catch (error) {
      console.error('Failed to generate schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAISchedule = async (scheduleData) => {
    try {
      setLoading(true);
      const newSchedule = await scheduleService.generateAISchedule(scheduleData);
      if (newSchedule) {
        setSchedule(newSchedule);
        setMood(newSchedule.mood);
      }
    } catch (error) {
      console.error('Failed to generate AI schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCompletion = async (taskId, isCompleted) => {
    if (!schedule) return;
    
    try {
      const success = await scheduleService.updateTaskStatus(
        schedule._id, 
        taskId, 
        isCompleted
      );
      if (success) {
        setSchedule(prev => ({
          ...prev,
          tasks: prev.tasks.map(task => 
            task._id === taskId ? { ...task, isCompleted } : task
          )
        }));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    loadScheduleForDate(newDate);
  };

  const loadScheduleForDate = async (date) => {
    try {
      const data = await scheduleService.getSchedule(date);
      if (data) {
        setSchedule(data);
        setMood(data.mood || '');
      } else {
        setSchedule(null);
        setMood('');
      }
    } catch (error) {
      console.error('Failed to load schedule for date:', error);
    }
  };

  const tabs = [
    { id: 'schedule', label: '   Schedule', icon: '📅' },
    { id: 'tasks', label: '   Tasks', icon: '  ' },
    { id: 'insights', label: '   Insights', icon: '📊' },
    { id: 'ai', label: '🤖 AI Assistant', icon: '🤖' }
  ];

  return (
    <div className="dashboard">
      <Navbar 
        user={user} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showAI={showAI}
        onToggleAI={() => setShowAI(!showAI)}
      />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>{getGreeting(user?.username || 'User')}</h1>
            <p>Let's make today productive!</p>
          </div>
          
          <div className="date-selector">
            <label htmlFor="date-picker">Select Date:</label>
            <input
              type="date"
              id="date-picker"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        <div className="dashboard-main">
          <div className="main-content">
            {activeTab === 'schedule' && (
              <div className="schedule-tab">
                <div className="schedule-inputs">
                  <MoodSelector 
                    mood={mood} 
                    setMood={setMood}
                    disabled={loading}
                  />
                  
                  {mood && (
                    <div className="schedule-actions">
                      <button
                        onClick={() => handleGenerateSchedule({
                          date: selectedDate,
                          mood,
                          taskIds: tasks.map(t => t._id)
                        })}
                        disabled={loading || tasks.length === 0}
                        className="generate-btn"
                      >
                        {loading ? 'Generating...' : 'Generate Schedule'}
                      </button>
                      
                      <button
                        onClick={() => setShowAI(true)}
                        disabled={loading || tasks.length === 0}
                        className="ai-btn"
                      >
                        🤖 AI Generate
                      </button>
                    </div>
                  )}
                </div>

                <ScheduleDisplay 
                  schedule={schedule}
                  tasks={tasks}
                  mood={mood}
                  onTaskCompletion={handleTaskCompletion}
                  loading={loading}
                />

                {schedule && (
                  <RoomAllocation 
                    schedule={schedule}
                    selectedDate={selectedDate}
                  />
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tasks-tab">
                <TaskInput 
                  onCreateTask={handleCreateTask}
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  loading={loading}
                />
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="insights-tab">
                <AIInsights 
                  insights={insights}
                  onLoadInsights={loadInsights}
                  loading={loading}
                />
                
                <MoodAnalysis 
                  mood={mood}
                  onLoadAnalysis={loadMoodAnalysis}
                  loading={loading}
                />
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="ai-tab">
                <AIScheduleGenerator 
                  tasks={tasks}
                  mood={mood}
                  onGenerateSchedule={handleGenerateAISchedule}
                  loading={loading}
                />
                
                <TaskRecommendations 
                  tasks={tasks}
                  mood={mood}
                  loading={loading}
                />
              </div>
            )}
          </div>

          {showAI && (
            <div className="ai-sidebar">
              <AIScheduleGenerator 
                tasks={tasks}
                mood={mood}
                onGenerateSchedule={handleGenerateAISchedule}
                loading={loading}
                compact={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;