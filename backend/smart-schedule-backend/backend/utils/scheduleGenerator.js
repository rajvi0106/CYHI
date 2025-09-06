const generateSchedule = (tasks, rooms, dayOfWeek, mood) => {
  const availableSlots = [];
  rooms.forEach(room => {
    const dayAvailability = room.availability.find(avail => avail.day === dayOfWeek);
    if (dayAvailability) {
      dayAvailability.timeSlots.forEach(slot => {
        availableSlots.push({
          start: slot.start,
          end: slot.end,
          room: room.roomNumber,
          roomId: room._id
        });
      });
    }
  });

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return a.duration - b.duration;
  });

  const scheduledTasks = [];
  const suggestions = [];
  let slotIndex = 0;

  if (mood === 'stressed') {
    suggestions.push('Consider scheduling short breaks between tasks');
    suggestions.push('Try to schedule easier tasks first');
  } else if (mood === 'energetic') {
    suggestions.push('Great time for challenging tasks!');
    suggestions.push('You can tackle longer tasks efficiently');
  } else if (mood === 'tired') {
    suggestions.push('Schedule lighter tasks and take frequent breaks');
    suggestions.push('Consider shorter task durations');
  }

  sortedTasks.forEach((task, index) => {
    if (slotIndex < availableSlots.length) {
      const slot = availableSlots[slotIndex];
      scheduledTasks.push({
        taskId: task._id,
        startTime: slot.start,
        endTime: slot.end,
        room: slot.room,
        isCompleted: false,
        energyLevel: index === 0 ? 'high' : index < 3 ? 'medium' : 'low'
      });
      slotIndex++;
    }
  });

  return {
    tasks: scheduledTasks,
    suggestions,
    unscheduledTasks: sortedTasks.slice(scheduledTasks.length)
  };
};

module.exports = { generateSchedule };