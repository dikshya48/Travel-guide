import dotenv from "dotenv";
import mongoose from "mongoose";
import { hash } from "bcrypt";
import Trip from "./models/Trip.js";
import User from "./models/User.js";
import connectDB from "./db.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    const userIds = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ];

    const users = [
      {
        _id: userIds[0],
        name: "Test User 1",
        email: "test1@example.com",
        password: await hash("password123", 10),
      },
      {
        _id: userIds[1],
        name: "Test User 2",
        email: "test2@example.com",
        password: await hash("password123", 10),
      },
      {
        _id: userIds[2],
        name: "Test User 3",
        email: "test3@example.com",
        password: await hash("password123", 10),
      },
    ];

    const trips = [
      {
        user: userIds[0],
        title: "Trip to Pokhara",
        destination: "Pokhara",
        startDate: new Date("2024-05-01"),
        endDate: new Date("2024-05-05"),
        notes: "Boating at Fewa Lake",
      },
      {
        user: userIds[0],
        title: "Kathmandu Tour",
        destination: "Kathmandu",
        startDate: new Date("2024-06-10"),
        endDate: new Date("2024-06-12"),
        notes: "Visit temples and Durbar Square",
      },
      {
        user: userIds[1],
        title: "Beach Vacation",
        destination: "Goa",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-07-07"),
        notes: "Enjoying the sunny beaches",
      },
      {
        user: userIds[1],
        title: "Mountain Adventure",
        destination: "Manali",
        startDate: new Date("2024-08-15"),
        endDate: new Date("2024-08-20"),
        notes: "Trekking in the Himalayas",
      },
      {
        user: userIds[2],
        title: "City Tour",
        destination: "New York City",
        startDate: new Date("2024-09-10"),
        endDate: new Date("2024-09-14"),
        notes: "Sightseeing and shopping",
      },
      {
        user: userIds[2],
        title: "Safari Adventure",
        destination: "Kenya",
        startDate: new Date("2024-10-01"),
        endDate: new Date("2024-10-10"),
        notes: "Wildlife safari in the Serengeti",
      },
      {
        user: userIds[0],
        title: "Cultural Exploration",
        destination: "Varanasi",
        startDate: new Date("2024-11-05"),
        endDate: new Date("2024-11-09"),
        notes: "Explore temples and cultural sites",
      },
      {
        user: userIds[1],
        title: "Meditation Retreat",
        destination: "Rishikesh",
        startDate: new Date("2024-12-10"),
        endDate: new Date("2024-12-15"),
        notes: "Yoga and meditation retreat",
      },
      {
        user: userIds[2],
        title: "Skiing Trip",
        destination: "Switzerland",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-01-20"),
        notes: "Skiing in the Swiss Alps",
      },
      {
        user: userIds[0],
        title: "Historical Tour",
        destination: "Rome",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-02-07"),
        notes: "Visit historical sites like the Colosseum and Roman Forum",
      },
    ];

    await mongoose.connection.dropDatabase();

    await User.insertMany(users);
    await Trip.insertMany(trips);

    console.log("Seeding complete with more data");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
