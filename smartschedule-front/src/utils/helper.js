export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const calculateDuration = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return end - start;
};

export const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getGreeting = (username) => {
  const timeOfDay = getTimeOfDay();
  const greetings = {
    morning: `Good morning, ${username}!`,
    afternoon: `Good afternoon, ${username}!`,
    evening: `Good evening, ${username}!`
  };
  return greetings[timeOfDay];
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: '#ff6b6b',
    medium: '#4ecdc4',
    low: '#95e1d3'
  };
  return colors[priority] || colors.medium;
};

export const getMoodEmoji = (mood) => {
  const emojis = {
    happy: '😊',
    stressed: '  ',
    focused: '🎯',
    tired: '  ',
    energetic: '⚡',
    anxious: '  ',
    calm: '  ',
    motivated: '💪'
  };
  return emojis[mood] || '  ';
};

export const getCategoryIcon = (category) => {
  const icons = {
    study: '  ',
    work: '💼',
    personal: '  ',
    break: '☕',
    exercise: '  ',
    other: '📝'
  };
  return icons[category] || '📝';
};