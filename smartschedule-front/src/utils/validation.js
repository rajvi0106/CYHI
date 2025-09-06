export const validateTask = (taskData) => {
  const errors = {};

  if (!taskData.name || taskData.name.trim().length === 0) {
    errors.name = 'Task name is required';
  } else if (taskData.name.length > 200) {
    errors.name = 'Task name must be less than 200 characters';
  }

  if (!taskData.duration || taskData.duration < 15 || taskData.duration > 480) {
    errors.duration = 'Duration must be between 15 and 480 minutes';
  }

  if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
    errors.priority = 'Priority must be low, medium, or high';
  }

  if (taskData.category && !['study', 'work', 'personal', 'break', 'exercise', 'other'].includes(taskData.category)) {
    errors.category = 'Invalid category';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUser = (userData) => {
  const errors = {};

  if (!userData.username || userData.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (userData.username.length > 30) {
    errors.username = 'Username must be less than 30 characters';
  }

  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'Please provide a valid email';
  }

  if (!userData.password || userData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSchedule = (scheduleData) => {
  const errors = {};

  if (!scheduleData.date) {
    errors.date = 'Date is required';
  }

  if (!scheduleData.mood || !['happy', 'stressed', 'focused', 'tired', 'energetic', 'anxious', 'calm', 'motivated'].includes(scheduleData.mood)) {
    errors.mood = 'Valid mood is required';
  }

  if (!scheduleData.taskIds || scheduleData.taskIds.length === 0) {
    errors.taskIds = 'At least one task is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};