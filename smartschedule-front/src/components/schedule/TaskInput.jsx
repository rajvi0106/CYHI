import React, { useState } from 'react';
import './TaskInput.css';

const TaskInput = ({ addTask, tasks, updateTask, deleteTask }) => {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      id: editingId || Date.now(), // fallback if no DB
      name: taskName,
      duration: parseInt(duration),
      priority
    };

    if (editingId) {
      updateTask(editingId, newTask);
      setEditingId(null);
    } else {
      addTask(newTask);
    }

    setTaskName('');
    setDuration(30);
    setPriority('medium');
  };

  const startEdit = (task) => {
    setTaskName(task.name);
    setDuration(task.duration);
    setPriority(task.priority);
    setEditingId(task.id);
  };

  const cancelEdit = () => {
    setTaskName('');
    setDuration(30);
    setPriority('medium');
    setEditingId(null);
  };

  return (
    <div className="task-input">
      <h3>📝 Add Tasks</h3>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="task-name-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (minutes):</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="duration-select"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="add-task-btn">
            {editingId ? 'Update Task' : 'Add Task'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="task-list">
        <h4>Your Tasks ({tasks.length})</h4>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks added yet. Add some tasks to get started!</p>
        ) : (
          <div className="tasks">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <span className="task-name">{task.name}</span>
                  <span className="task-duration">{task.duration} min</span>
                  <span className={`task-priority priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => startEdit(task)}
                    className="edit-btn"
                  >
                    ✏
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskInput;
