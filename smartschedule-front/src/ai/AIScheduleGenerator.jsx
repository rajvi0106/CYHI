import React, { useState } from 'react';
import { useAI } from '../hooks/useAI';
import './AIScheduleGenerator.css';

const AIScheduleGenerator = ({ 
  tasks, 
  mood, 
  onGenerateSchedule, 
  loading, 
  compact = false 
}) => {
  const { generateRecommendations } = useAI();
  const [userPreferences, setUserPreferences] = useState({
    workingHours: { start: '09:00', end: '17:00' },
    breakDuration: 15,
    maxTaskDuration: 120
  });
  const [availableTime, setAvailableTime] = useState(480);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!mood || tasks.length === 0) return;
    
    setIsGenerating(true);
    try {
      const recommendations = await generateRecommendations(
        tasks, 
        mood, 
        availableTime, 
        userPreferences
      );
      
      if (recommendations && onGenerateSchedule) {
        onGenerateSchedule({
          date: new Date().toISOString().split('T')[0],
          mood,
          taskIds: tasks.map(t => t._id),
          userPreferences,
          aiRecommendations: recommendations
        });
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (compact) {
    return (
      <div className="ai-generator-compact">
        <h3>🤖 AI Schedule Generator</h3>
        <div className="compact-info">
          <p>Tasks: {tasks.length}</p>
          <p>Mood: {mood || 'Not selected'}</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || loading || !mood || tasks.length === 0}
          className="ai-generate-btn"
        >
          {isGenerating ? '   Generating...' : '🤖 Generate AI Schedule'}
        </button>
      </div>
    );
  }

  return (
    <div className="ai-schedule-generator">
      <div className="generator-header">
        <h2>🤖 AI Schedule Generator</h2>
        <p>Let AI create the perfect schedule based on your mood and preferences</p>
      </div>

      <div className="generator-content">
        <div className="preferences-section">
          <h3>⚙ Preferences</h3>
          <div className="preferences-grid">
            <div className="preference-group">
              <label>Available Time (minutes):</label>
              <input
                type="number"
                value={availableTime}
                onChange={(e) => setAvailableTime(parseInt(e.target.value))}
                min="60"
                max="480"
                className="preference-input"
              />
            </div>
            
            <div className="preference-group">
              <label>Working Hours:</label>
              <div className="time-inputs">
                <input
                  type="time"
                  value={userPreferences.workingHours.start}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, start: e.target.value }
                  }))}
                  className="time-input"
                />
                <span>to</span>
                <input
                  type="time"
                  value={userPreferences.workingHours.end}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, end: e.target.value }
                  }))}
                  className="time-input"
                />
              </div>
            </div>

            <div className="preference-group">
              <label>Break Duration (minutes):</label>
              <input
                type="number"
                value={userPreferences.breakDuration}
                onChange={(e) => setUserPreferences(prev => ({
                  ...prev,
                  breakDuration: parseInt(e.target.value)
                }))}
                min="5"
                max="60"
                className="preference-input"
              />
            </div>

            <div className="preference-group">
              <label>Max Task Duration (minutes):</label>
              <input
                type="number"
                value={userPreferences.maxTaskDuration}
                onChange={(e) => setUserPreferences(prev => ({
                  ...prev,
                  maxTaskDuration: parseInt(e.target.value)
                }))}
                min="15"
                max="240"
                className="preference-input"
              />
            </div>
          </div>
        </div>

        <div className="generation-section">
          <div className="generation-info">
            <div className="info-item">
              <span className="info-label">Tasks Available:</span>
              <span className="info-value">{tasks.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Current Mood:</span>
              <span className="info-value">{mood || 'Not selected'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Available Time:</span>
              <span className="info-value">{availableTime} minutes</span>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || loading || !mood || tasks.length === 0}
            className="ai-generate-btn-large"
          >
            {isGenerating ? (
              <>
                <div className="loading-spinner"></div>
                Generating...
              </>
            ) : (
              <>
                🤖 Generate AI Schedule
              </>
            )}
          </button>
          
          {!mood && (
            <p className="warning">⚠ Please select your mood first</p>
          )}
          
          {tasks.length === 0 && (
            <p className="warning">⚠ Please add some tasks first</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIScheduleGenerator;