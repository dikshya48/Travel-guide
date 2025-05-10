import express, { json, static as  serveStatic} from 'express';
import dotenv from "dotenv"
import { promises as fs } from 'fs';
import { join } from 'path';
import { hash, compare } from 'bcrypt';
import cors from 'cors';
import Trip from './models/Trip.js';
import connectDB from './db.js';

const app = express();
dotenv.config();


app.use(json());
app.use(cors());
app.use(serveStatic('public')); 

const port = process.env.PORT || 3000;

//connect to database
connectDB();

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const data = await fs.readFile(dbPath);
        const users = JSON.parse(data);

        if (users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword
        };

        users.push(newUser);
        await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const data = await fs.readFile(dbPath);
        
        const users = JSON.parse(data);

        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// save trip data to db
app.post('/api/trip', async (req, res) => {
    try {
        const trip = new Trip({ user: req.user.id, ...req.body });
        await trip.save();
        res.status(201).json({ trip, message: 'Users saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/trips', async (req, res) => {
    try {
    const trips = await Trip.find({ user: req.user.id });
    res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.patch('/api/trip/:id', async (req, res) => {
    try {
    let trip = await Trip.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true }
        );
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.delete('/api/trip/:id', async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json({ message: 'Trip deleted' });   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});