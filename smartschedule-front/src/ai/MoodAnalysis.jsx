import React, { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import './MoodAnalysis.css';

const MoodAnalysis = ({ mood, onLoadAnalysis, loading }) => {
  const { loadMoodAnalysis } = useAI();
  const [moodData, setMoodData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mood && onLoadAnalysis) {
      loadMoodData();
    }
  }, [mood]);

  const loadMoodData = async () => {
    setIsLoading(true);
    try {
      const data = await onLoadAnalysis();
      setMoodData(data);
    } catch (error) {
      console.error('Failed to load mood analysis:', error);
    } finally {
      setIsLoading(false);
    }
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

  const getMoodColor = (moodType) => {
    const colors = {
      'happy': '#4ecdc4',
      'stressed': '#ff6b6b',
      'focused': '#667eea',
      'tired': '#95a5a6',
      'energetic': '#f39c12',
      'anxious': '#e74c3c',
      'calm': '#2ecc71',
      'motivated': '#9b59b6'
    };
    return colors[moodType] || '#6c757d';
  };

  if (isLoading || loading) {
    return (
      <div className="mood-analysis">
        <div className="analysis-header">
          <h2>😊 Mood Analysis</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-analysis">
      <div className="analysis-header">
        <h2>😊 Mood Analysis</h2>
        <button 
          onClick={loadMoodData}
          className="refresh-btn"
          disabled={isLoading}
        >
             Refresh
        </button>
      </div>

      {moodData && moodData.length > 0 ? (
        <div className="analysis-content">
          {/* Current Mood */}
          {mood && (
            <div className="current-mood-card">
              <h3>Current Mood</h3>
              <div className="current-mood">
                <div 
                  className="mood-circle"
                  style={{ backgroundColor: getMoodColor(mood) }}
                >
                  {getMoodEmoji(mood)}
                </div>
                <div className="mood-details">
                  <h4>{mood.charAt(0).toUpperCase() + mood.slice(1)}</h4>
                  <p>Your current emotional state</p>
                </div>
              </div>
            </div>
          )}

          {/* Mood Statistics */}
          <div className="mood-stats-card">
            <h3>   Mood Statistics</h3>
            <div className="mood-stats-grid">
              {moodData.map((moodStat, index) => (
                <div key={moodStat.mood} className="mood-stat-item">
                  <div className="mood-stat-header">
                    <div 
                      className="mood-stat-icon"
                      style={{ backgroundColor: getMoodColor(moodStat.mood) }}
                    >
                      {getMoodEmoji(moodStat.mood)}
                    </div>
                    <div className="mood-stat-info">
                      <h4>{moodStat.mood.charAt(0).toUpperCase() + moodStat.mood.slice(1)}</h4>
                      <p>{moodStat.frequency} times</p>
                    </div>
                  </div>
                  
                  <div className="mood-stat-metrics">
                    <div className="metric">
                      <span className="metric-label">Completion Rate:</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill"
                          style={{ 
                            width: `${moodStat.completionRate * 100}%`,
                            backgroundColor: getMoodColor(moodStat.mood)
                          }}
                        ></div>
                      </div>
                      <span className="metric-value">
                        {Math.round(moodStat.completionRate * 100)}%
                      </span>
                    </div>
                    
                    <div className="metric">
                      <span className="metric-label">Total Tasks:</span>
                      <span className="metric-value">{moodStat.totalTasks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Insights */}
          <div className="mood-insights-card">
            <h3>💡 Mood Insights</h3>
            <div className="insights-list">
              {moodData.length > 0 && (
                <div className="insight-item">
                  <span className="insight-icon">🏆</span>
                  <span className="insight-text">
                    Your most productive mood is <strong>
                      {moodData.reduce((best, current) => 
                        current.completionRate > best.completionRate ? current : best
                      ).mood}
                    </strong> with a {Math.round(
                      moodData.reduce((best, current) => 
                        current.completionRate > best.completionRate ? current : best
                      ).completionRate * 100
                    )}% completion rate.
                  </span>
                </div>
              )}
              
              {moodData.length > 1 && (
                <div className="insight-item">
                  <span className="insight-icon">📈</span>
                  <span className="insight-text">
                    You've tracked {moodData.length} different moods, showing good emotional awareness.
                  </span>
                </div>
              )}
              
              <div className="insight-item">
                <span className="insight-icon">💪</span>
                <span className="insight-text">
                  Keep using the app to build better mood-based productivity patterns!
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-mood-data">
          <div className="no-data-icon">  </div>
          <h3>No Mood Data Available</h3>
          <p>Start creating schedules with different moods to see your analysis!</p>
          <button onClick={loadMoodData} className="load-data-btn">
            Load Mood Data
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodAnalysis;