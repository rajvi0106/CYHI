import React from 'react';
import './ScheduleDisplay.css';

const ScheduleDisplay = ({ schedule, tasks, mood }) => {
  const getTimeSlotColor = (priority) => {
    const colors = {
      high: '#ff6b6b',
      medium: '#4ecdc4',
      low: '#95e1d3'
    };
    return colors[priority] || colors.medium;
  };

  const getMoodIcon = (mood) => {
    const icons = {
      happy: '😊',
      stressed: '😫',
      focused: '🎯',
      tired: '😴',
      energetic: '⚡',
      anxious: '😟',
      calm: '😌',
      motivated: '💪'
    };
    return icons[mood] || '😊';
  };

  return (
    <div className="schedule-display">
      <div className="schedule-header">
        <h3>📅 Your Daily Schedule</h3>
        {mood && (
          <div className="mood-indicator">
            <span className="mood-icon">{getMoodIcon(mood)}</span>
            <span className="mood-text">Mood: {mood}</span>
          </div>
        )}
      </div>

      {schedule.length === 0 ? (
        <div className="no-schedule">
          <p>Add some tasks to see your personalized schedule!</p>
        </div>
      ) : (
        <div className="schedule-timeline">
          {schedule.map((item) => (
            <div key={item.id} className="schedule-item">
              <div className="time-slot">
                <div className="time">{item.startTime}</div>
                <div className="time-separator">-</div>
                <div className="time">{item.endTime}</div>
              </div>
              
              <div 
                className="task-block"
                style={{ 
                  borderLeftColor: getTimeSlotColor(item.priority),
                  backgroundColor: `${getTimeSlotColor(item.priority)}20`
                }}
              >
                <div className="task-content">
                  <h4 className="task-title">{item.task}</h4>
                  <div className="task-meta">
                    <span className="duration">⏱ {item.duration} min</span>
                    <span className={`priority priority-${item.priority}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
                
                <div className="room-assignment">
                  <span className="room-icon">🏠</span>
                  <span className="room-name">{item.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tasks.length > 0 && schedule.length < tasks.length && (
        <div className="unscheduled-tasks">
          <h4>⚠ Unscheduled Tasks</h4>
          <p>Some tasks couldn't be scheduled due to time constraints.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleDisplay;
