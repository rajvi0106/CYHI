import React, { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../utils/constants';
import './TaskRecommendations.css';

const TaskRecommendations = ({ tasks, mood, loading }) => {
  const { generateRecommendations } = useAI();
  const [recommendations, setRecommendations] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableTime, setAvailableTime] = useState(480);

  useEffect(() => {
    if (mood && tasks.length > 0) {
      generateTaskRecommendations();
    }
  }, [mood, tasks]);

  const generateTaskRecommendations = async () => {
    setIsGenerating(true);
    try {
      const recs = await generateRecommendations(
        tasks,
        mood,
        availableTime,
        {}
      );
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category) => {
    const cat = TASK_CATEGORIES.find(c => c.value === category);
    return cat ? cat.icon : '📝';
  };

  const getPriorityColor = (priority) => {
    const pri = TASK_PRIORITIES.find(p => p.value === priority);
    return pri ? pri.color : '#6c757d';
  };

  const getMoodEmoji = (moodType) => {
    const emojis = {
      'happy': '😊',
      'stressed': '  ',
      'focused': '  ',
      'tired': '  ',
      'energetic': '⚡',
      'anxious': '😟',
      'calm': '  ',
      'motivated': '  '
    };
    return emojis[moodType] || '😐';
  };

  const getMoodSuggestions = (moodType) => {
    const suggestions = {
      'happy': [
        'Great time to tackle creative tasks!',
        'Your positive energy will help with complex projects',
        'Consider adding some fun activities to your schedule'
      ],
      'stressed': [
        'Break large tasks into smaller, manageable chunks',
        'Start with easier tasks to build momentum',
        'Take frequent breaks to maintain focus'
      ],
      'focused': [
        'Perfect time for detail-oriented work',
        'Tackle your most challenging tasks now',
        'Minimize distractions and work in longer blocks'
      ],
      'tired': [
        'Start with lighter, routine tasks',
        'Consider shorter work sessions with breaks',
        'Save energy-intensive tasks for later'
      ],
      'energetic': [
        'Tackle your most challenging tasks first!',
        'Great time for physical or creative activities',
        'Use this energy for high-priority items'
      ],
      'anxious': [
        'Start with familiar, comfortable tasks',
        'Break work into very small steps',
        'Use breathing exercises between tasks'
      ],
      'calm': [
        'Good time for thoughtful, analytical work',
        'Perfect for planning and organization',
        'Use this state for decision-making tasks'
      ],
      'motivated': [
        'Channel this motivation into important projects',
        'Great time to start new initiatives',
        'Use this drive for high-impact tasks'
      ]
    };
    return suggestions[moodType] || ['Focus on one task at a time', 'Take breaks when needed'];
  };

  if (isGenerating || loading) {
    return (
      <div className="task-recommendations">
        <div className="recommendations-header">
          <h2>💡 Task Recommendations</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-recommendations">
      <div className="recommendations-header">
        <h2>💡 Task Recommendations</h2>
        <div className="header-controls">
          <div className="time-input-group">
            <label>Available Time:</label>
            <input
              type="number"
              value={availableTime}
              onChange={(e) => setAvailableTime(parseInt(e.target.value))}
              min="60"
              max="480"
              className="time-input"
            />
            <span>min</span>
          </div>
          <button 
            onClick={generateTaskRecommendations}
            disabled={isGenerating || !mood || tasks.length === 0}
            className="refresh-btn"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {!mood && (
        <div className="no-mood-warning">
          <div className="warning-icon">⚠</div>
          <p>Please select your mood to get personalized task recommendations</p>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="no-tasks-warning">
          <div className="warning-icon">  </div>
          <p>Add some tasks to get AI recommendations</p>
        </div>
      )}

      {mood && tasks.length > 0 && (
        <div className="recommendations-content">
          {/* Current Mood Context */}
          <div className="mood-context">
            <div className="mood-display">
              <div className="mood-emoji">{getMoodEmoji(mood)}</div>
              <div className="mood-info">
                <h3>Current Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}</h3>
                <p>AI recommendations based on your current emotional state</p>
              </div>
            </div>
          </div>

          {/* Mood-specific Suggestions */}
          <div className="mood-suggestions">
            <h3>   Mood-Based Tips</h3>
            <div className="suggestions-list">
              {getMoodSuggestions(mood).map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  <span className="suggestion-icon">💡</span>
                  <span className="suggestion-text">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          {recommendations ? (
            <div className="ai-recommendations">
              <h3>🤖 AI Task Recommendations</h3>
              
              {/* Recommended Order */}
              {recommendations.recommendedOrder && (
                <div className="recommended-order">
                  <h4>📋 Recommended Task Order</h4>
                  <div className="task-order-list">
                    {recommendations.recommendedOrder.map((taskId, index) => {
                      const task = tasks.find(t => t._id === taskId);
                      if (!task) return null;
                      
                      return (
                        <div key={taskId} className="order-item">
                          <div className="order-number">{index + 1}</div>
                          <div className="task-info">
                            <div className="task-name">{task.name}</div>
                            <div className="task-meta">
                              <span className="task-category">
                                {getCategoryIcon(task.category)} {task.category}
                              </span>
                              <span 
                                className="task-priority"
                                style={{ color: getPriorityColor(task.priority) }}
                              >
                                {task.priority} priority
                              </span>
                              <span className="task-duration">{task.duration}min</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Time Slots */}
              {recommendations.timeSlots && (
                <div className="time-slots">
                  <h4>⏰ Suggested Time Slots</h4>
                  <div className="slots-list">
                    {recommendations.timeSlots.map((slot, index) => {
                      const task = tasks.find(t => t._id === slot.taskId);
                      if (!task) return null;
                      
                      return (
                        <div key={index} className="slot-item">
                          <div className="slot-time">
                            <div className="time-range">
                              {slot.startTime} - {slot.endTime}
                            </div>
                            <div className="room-info">Room {slot.room}</div>
                          </div>
                          <div className="slot-task">
                            <div className="task-name">{task.name}</div>
                            <div className="task-details">
                              <span className={energy-level `${slot.energyLevel}`}>
                                {slot.energyLevel} energy
                              </span>
                              {slot.breakAfter && (
                                <span className="break-indicator">Break after</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Break Schedule */}
              {recommendations.breakSchedule && recommendations.breakSchedule.length > 0 && (
                <div className="break-schedule">
                  <h4>☕ Break Schedule</h4>
                  <div className="breaks-list">
                    {recommendations.breakSchedule.map((breakItem, index) => (
                      <div key={index} className="break-item">
                        <div className="break-time">{breakItem.time}</div>
                        <div className="break-duration">{breakItem.duration}min</div>
                        <div className="break-activity">{breakItem.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              {recommendations.suggestions && (
                <div className="ai-suggestions">
                  <h4>🧠 AI Insights</h4>
                  <div className="ai-suggestions-list">
                    {recommendations.suggestions.map((suggestion, index) => (
                      <div key={index} className="ai-suggestion-item">
                        <span className="ai-icon">🤖</span>
                        <span className="ai-text">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-recommendations">
              <div className="no-rec-icon">🤖</div>
              <h3>No Recommendations Yet</h3>
              <p>Click refresh to generate AI-powered task recommendations</p>
              <button 
                onClick={generateTaskRecommendations}
                disabled={isGenerating}
                className="generate-btn"
              >
                {isGenerating ? 'Generating...' : 'Generate Recommendations'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskRecommendations;