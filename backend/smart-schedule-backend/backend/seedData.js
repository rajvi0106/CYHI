const mongoose = require('mongoose');
const Room = require('./models/Room');

const seedRooms = async () => {
  try {
    await Room.deleteMany({});

    const rooms = [
      {
        roomNumber: '101',
        capacity: 4,
        facilities: ['whiteboard', 'wifi'],
        availability: [
          {
            day: 'wednesday',
            timeSlots: [
              { start: '16:00', end: '17:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '102',
        capacity: 6,
        facilities: ['whiteboard', 'projector', 'wifi'],
        availability: [
          {
            day: 'monday',
            timeSlots: [
              { start: '10:00', end: '11:00' },
              { start: '14:00', end: '16:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '104',
        capacity: 3,
        facilities: ['whiteboard', 'wifi'],
        availability: [
          {
            day: 'tuesday',
            timeSlots: [
              { start: '09:00', end: '10:00' },
              { start: '14:00', end: '15:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '105',
        capacity: 8,
        facilities: ['whiteboard', 'projector', 'computer', 'wifi'],
        availability: [
          {
            day: 'monday',
            timeSlots: [
              { start: '10:00', end: '11:00' },
              { start: '14:00', end: '16:00' }
            ]
          },
          {
            day: 'friday',
            timeSlots: [
              { start: '12:00', end: '17:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '106',
        capacity: 5,
        facilities: ['whiteboard', 'wifi', 'air_conditioning'],
        availability: [
          {
            day: 'tuesday',
            timeSlots: [
              { start: '09:00', end: '10:00' },
              { start: '14:00', end: '15:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '201',
        capacity: 6,
        facilities: ['whiteboard', 'projector', 'wifi'],
        availability: [
          {
            day: 'friday',
            timeSlots: [
              { start: '12:00', end: '17:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '202',
        capacity: 4,
        facilities: ['whiteboard', 'wifi'],
        availability: [
          {
            day: 'monday',
            timeSlots: [
              { start: '10:00', end: '11:00' },
              { start: '14:00', end: '16:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '206',
        capacity: 7,
        facilities: ['whiteboard', 'projector', 'computer', 'wifi', 'air_conditioning'],
        availability: [
          {
            day: 'wednesday',
            timeSlots: [
              { start: '16:00', end: '17:00' }
            ]
          },
          {
            day: 'thursday',
            timeSlots: [
              { start: '09:00', end: '11:00' }
            ]
          }
        ]
      },
      {
        roomNumber: '207',
        capacity: 5,
        facilities: ['whiteboard', 'wifi'],
        availability: [
          {
            day: 'thursday',
            timeSlots: [
              { start: '09:00', end: '11:00' }
            ]
          }
        ]
      }
    ];

    await Room.insertMany(rooms);
    console.log('Room data seeded successfully');
  } catch (error) {
    console.error('Error seeding room data:', error);
  }
};

module.exports = { seedRooms };