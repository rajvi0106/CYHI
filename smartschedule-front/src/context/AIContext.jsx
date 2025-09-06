import React, { createContext, useContext, useState } from 'react';
import aiService from '../service/aiService';

const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [insights, setInsights] = useState(null);
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecommendations = async (tasks, mood, availableTime, userPreferences) => {
    setLoading(true);
    try {
      const recommendations = await aiService.generateTaskRecommendations(
        tasks, 
        mood, 
        availableTime, 
        userPreferences
      );
      return recommendations;
    } catch (error) {
      console.error('Generate recommendations error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    setLoading(true);
    try {
      const insightsData = await aiService.getPersonalizedInsights();
      setInsights(insightsData);
      return insightsData;
    } catch (error) {
      console.error('Load insights error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadMoodAnalysis = async () => {
    setLoading(true);
    try {
      const moodData = await aiService.analyzeMoodPatterns();
      setMoodAnalysis(moodData);
      return moodData;
    } catch (error) {
      console.error('Load mood analysis error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    insights,
    moodAnalysis,
    loading,
    generateRecommendations,
    loadInsights,
    loadMoodAnalysis
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};