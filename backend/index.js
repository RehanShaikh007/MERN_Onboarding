import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import clientRoutes from "./routes/clientRoutes.js";
import talentRoutes from "./routes/talentRoutes.js";
import { seedSampleData } from "./utils/seedData.js";
import path from "path"

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow credentials (cookies)
  }));

app.use(express.json());

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/talents', talentRoutes);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BreadButter Talent Matchmaking API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to BreadButter Talent Matchmaking API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            clients: '/api/clients',
            talents: '/api/talents'
        }
    });
});

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("Connected to MongoDB");
    
    // Seed sample data if database is empty
    try {
        await seedSampleData();
        console.log("Sample data seeded successfully");
    } catch (error) {
        console.log("Sample data seeding failed:", error.message);
    }
})
.catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
});
