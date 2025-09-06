import React, { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import './AIInsights.css';

const AIInsights = ({ insights, onLoadInsights, loading }) => {
  const [localInsights, setLocalInsights] = useState(insights);

  useEffect(() => {
    if (insights) {
      setLocalInsights(insights);
    }
  }, [insights]);

  const handleLoadInsights = async () => {
    try {
      const data = await onLoadInsights();
      setLocalInsights(data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  if (loading) {
    return (
      <div className="ai-insights">
        <div className="insights-header">
          <h2>📊 AI Insights</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-insights">
      <div className="insights-header">
        <h2>📊 AI Insights</h2>
        <button 
          onClick={handleLoadInsights}
          className="refresh-btn"
          disabled={loading}
        >
             Refresh
        </button>
      </div>

      {localInsights ? (
        <div className="insights-content">
          {/* Most Productive Moods */}
          {localInsights.mostProductiveMoods && localInsights.mostProductiveMoods.length > 0 && (
            <div className="insight-card">
              <h3>🎯 Most Productive Moods</h3>
              <div className="mood-stats">
                {localInsights.mostProductiveMoods.slice(0, 3).map((mood, index) => (
                  <div key={mood.mood} className="mood-stat">
                    <div className="mood-info">
                      <span className="mood-emoji">
                        {mood.mood === 'happy' ? '😊' : 
                         mood.mood === 'focused' ? '🎯' :
                         mood.mood === 'energetic' ? '⚡' :
                         mood.mood === 'tired' ? '😴' :
                         mood.mood === 'stressed' ? '😰' :
                         mood.mood === 'anxious' ? '😟' :
                         mood.mood === 'calm' ? '😌' :
                         mood.mood === 'motivated' ? '💪' : '😐'}
                      </span>
                      <span className="mood-name">{mood.mood}</span>
                    </div>
                    <div className="productivity-bar">
                      <div 
                        className="productivity-fill"
                        style={{ width: `${mood.averageProductivity * 100}% `}}
                      ></div>
                    </div>
                    <span className="productivity-score">
                      {Math.round(mood.averageProductivity * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Peak Hours */}
          {localInsights.peakHours && localInsights.peakHours.length > 0 && (
            <div className="insight-card">
              <h3>⏰ Peak Productivity Hours</h3>
              <div className="hours-chart">
                {localInsights.peakHours.slice(0, 5).map((hour, index) => (
                  <div key={hour.hour} className="hour-bar">
                    <div className="hour-label">{hour.hour}:00</div>
                    <div className="hour-progress">
                      <div 
                        className="hour-fill"
                        style={{ width: `${hour.productivity * 100}%` }}
                      ></div>
                    </div>
                    <div className="hour-score">
                      {Math.round(hour.productivity * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {localInsights.recommendations && localInsights.recommendations.length > 0 && (
            <div className="insight-card">
              <h3>💡 Personalized Recommendations</h3>
              <div className="recommendations-list">
                {localInsights.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <span className="rec-icon">💡</span>
                    <span className="rec-text">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Schedules */}
          <div className="insight-card">
            <h3>   Usage Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{localInsights.totalSchedules || 0}</div>
                <div className="stat-label">Total Schedules</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {localInsights.mostProductiveMoods ? localInsights.mostProductiveMoods.length : 0}
                </div>
                <div className="stat-label">Moods Tracked</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-insights">
          <div className="no-insights-icon">  </div>
          <h3>No Insights Available</h3>
          <p>Generate some schedules to see your productivity insights!</p>
          <button onClick={handleLoadInsights} className="load-insights-btn">
            Load Insights
          </button>
        </div>
      )}
    </div>
  );
};

export default AIInsights;