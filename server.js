const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public')); 

const dbPath = path.join(__dirname, 'user.json');

async function initializeDb() {
    try {
        await fs.access(dbPath);
    } catch {
        await fs.writeFile(dbPath, JSON.stringify([]));
    }
}
initializeDb();

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

        const hashedPassword = await bcrypt.hash(password, 10);
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

        const isMatch = await bcrypt.compare(password, user.password);
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
        
        res.json({ message: 'Users saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/trips', async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
app.patch('/api/trip/:id', async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
app.delete('/api/trip/:id', async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});