import React from 'react';
import './MoodSelector.css';

const MoodSelector = ({ mood, setMood }) => {
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'stressed', emoji: '😫', label: 'Stressed' },
    { id: 'focused', emoji: '🎯', label: 'Focused' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
    { id: 'energetic', emoji: '⚡', label: 'Energetic' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'motivated', emoji: '💪', label: 'Motivated' }
  ];

  return (
    <div className="mood-selector">
      <h3>😊 How are you feeling today?</h3>
      <div className="mood-options">
        {moods.map(moodOption => (
          <button
            key={moodOption.id}
            className={`mood-btn ${mood === moodOption.id ? 'selected' : ''}`}
            onClick={() => setMood(moodOption.id)}
          >
            <span className="mood-emoji">{moodOption.emoji}</span>
            <span className="mood-label">{moodOption.label}</span>
          </button>
        ))}
      </div>
      {mood && (
        <div className="selected-mood">
          <p>
            Selected: <strong>{moods.find(m => m.id === mood)?.label}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
