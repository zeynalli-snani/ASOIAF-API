require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

global.isRedisReady = false; 

const redisClient = createClient({ 
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      // we try to reconnect 3 times, if its unsuccessfull we give up and use the DB
      if (retries > 3) {
        console.log('Redis retries exhausted. Running API without cache.');
        return new Error('Redis down');
      }
      return Math.min(retries * 50, 500); 
    }
  }
});

redisClient.on('error', (err) => {
  global.isRedisReady = false;
});

redisClient.on('ready', () => {
  console.log('Connected to Redis Cache');
  global.isRedisReady = true;
});

redisClient.connect().catch(() => {
  console.log('Initial Redis connection failed. Falling back to primary database.');
});

module.exports = { app, redisClient };

app.get('/', (req, res) => {
  res.send('ASOIAF API Backend is up and running securely.');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});