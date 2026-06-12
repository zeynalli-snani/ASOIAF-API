require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('redis');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');

const authRoutes = require('./src/routes/authRoutes');
const characterRoutes = require('./src/routes/characterRoutes');
const userRoutes = require('./src/routes/userRoutes');
const passport = require('passport');
require('./src/config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Redis Settings
global.isRedisReady = false; 

// Attach directly to global to bypass circular dependency import issues
global.redisClient = createClient({ 
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.log('Redis retries exhausted. Running API without cache.');
        return new Error('Redis down');
      }
      return Math.min(retries * 50, 500); 
    }
  }
});

global.redisClient.on('error', (err) => {
  global.isRedisReady = false;
});

global.redisClient.on('ready', () => {
  console.log('Connected to Redis Cache');
  global.isRedisReady = true;
});

global.redisClient.connect().catch(() => {
  console.log('Initial Redis connection failed. Falling back to primary database.');
});

// No need to export redisClient anymore
module.exports = { app };

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('ASOIAF API Backend is up and running securely.');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});