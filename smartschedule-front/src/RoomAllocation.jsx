import React from 'react';
import './RoomAllocation.css';

const RoomAllocation = ({ rooms, schedule, availableSlots }) => {
  const getRoomUsage = () => {
    const usage = {};
    rooms.forEach(room => {
      usage[room] = {
        total: 0,
        scheduled: 0,
        tasks: []
      };
    });

    // Count scheduled tasks per room
    schedule.forEach(item => {
      if (usage[item.room]) {
        usage[item.room].scheduled++;
        usage[item.room].tasks.push(item);
      }
    });

    // Count total available slots per room
    availableSlots.forEach(slot => {
      if (usage[slot.room]) {
        usage[slot.room].total++;
      }
    });

    return usage;
  };

  const roomUsage = getRoomUsage();

  return (
    <div className="room-allocation">
      <h3>   Room Allocation</h3>
      
      <div className="rooms-grid">
        {rooms.map(room => {
          const usage = roomUsage[room];
          const utilization = usage.total > 0 ? (usage.scheduled / usage.total) * 100 : 0;
          
          return (
            <div key={room} className="room-card">
              <div className="room-header">
                <h4>{room}</h4>
                <div className="utilization">
                  {utilization.toFixed(0)}% utilized
                </div>
              </div>
              
              <div className="room-stats">
                <div className="stat">
                  <span className="stat-label">Scheduled:</span>
                  <span className="stat-value">{usage.scheduled}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Available:</span>
                  <span className="stat-value">{usage.total - usage.scheduled}</span>
                </div>
              </div>

              <div className="room-tasks">
                {usage.tasks.length > 0 ? (
                  <div className="scheduled-tasks">
                    {usage.tasks.map(task => (
                      <div key={task.id} className="room-task">
                        <span className="task-time">{task.startTime}</span>
                        <span className="task-name">{task.task}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-tasks">No tasks scheduled</div>
                )}
              </div>

              <div className="room-status">
                <div 
                  className={`status-indicator ${
                    utilization === 100 ? 'full' : 
                    utilization > 70 ? 'busy' : 'available'
                  }`}
                >
                  {utilization === 100 ? 'Full' : 
                   utilization > 70 ? 'Busy' : 'Available'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="room-summary">
        <h4>📊 Summary</h4>
        <div className="summary-stats">
          <div className="summary-item">
            <span>Total Rooms:</span>
            <span>{rooms.length}</span>
          </div>
          <div className="summary-item">
            <span>Available Slots:</span>
            <span>{availableSlots.length}</span>
          </div>
          <div className="summary-item">
            <span>Scheduled Tasks:</span>
            <span>{schedule.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;