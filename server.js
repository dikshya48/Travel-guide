import express from "express";
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

app.use(auth);

app.post("/api/trip", async (req, res) => {
  try {
    const trip = new Trip({ user: req.user.id, ...req.body });
    await trip.save();
    res.status(201).json({ trip, message: "Users saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id });
    if (trips.length === 0) {
      return res.status(404).json({ error: "No trips found for this user" });
    }

    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/trip/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req);
    if (req.body.startDate) {
      req.body.startDate = new Date(req.body.startDate);
    }
    if (req.body.endDate) {
      req.body.endDate = new Date(req.body.endDate);
    }

    const trip = await Trip.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or you don't have permission" });
    }

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/trip/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!trip) {
      return res
        .status(404)
        .json({ error: "Trip not found or you don't have permission" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/find-buddies", async (req, res) => {
  const { destination, interest } = req.query;
  try {
    const trips = await Trip.find({
      $or: [
        { destination: { $regex: destination, $options: "i" } },
        { interest: { $regex: interest, $options: "i" } },
      ],
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
