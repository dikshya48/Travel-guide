import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { hash } from 'bcrypt';
import Trip from './models/Trip.js';
import User from './models/User.js'
import connectDB from './db.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId();

    const users = [
      {
        _id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: await hash('password123', 10),
      },
    ];

    const trips = [
      {
        user: userId,
        title: 'Trip to Pokhara',
        destination: 'Pokhara',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-05-05'),
        notes: 'Boating at Fewa Lake',
      },
      {
        user: userId,
        title: 'Kathmandu Tour',
        destination: 'Kathmandu',
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-12'),
        notes: 'Visit temples and Durbar Square',
      },
    ];

    await mongoose.connection.dropDatabase();
    await User.insertMany(users);
    await Trip.insertMany(trips);

    console.log('Seeding complete');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
