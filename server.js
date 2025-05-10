import express, { json, static as serveStatic } from "express";
import dotenv from "dotenv";
import { hash, compare } from "bcrypt";
import cors from "cors";
import Trip from "./models/Trip.js";
import connectDB from "./db.js";
import User from "./models/User.js";
import auth, { verifyToken } from "./authMiddleware.js";
import { generateToken } from "./utils.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(serveStatic("public"));

const port = process.env.PORT || 3000;

//connect to database
connectDB();

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const user = await User.create(newUser);
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/check-auth", verifyToken, (req, res) => {
  res.json({ message: "Token is valid" });
});

// save trip data to db
app.post("/api/trip", auth, async (req, res) => {
  try {
    const trip = new Trip({ user: req.user.id, ...req.body });
    await trip.save();
    res.status(201).json({ trip, message: "Users saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/trips", auth, async (req, res) => {
  try {
    console.log(Trip);
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/trip/:id", async (req, res) => {
  try {
    let trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/trip/:id", async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
