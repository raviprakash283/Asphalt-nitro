

const express = require('express');
const dotenv = require('dotenv');
const pool = require("./config/db");

const walletRoutes = require('../src/routes/wallet.routes');
const rewardRoutes = require('../src/routes/reward.routes');


dotenv.config();

const app = express();

app.use(express.json());

app.use('/v1/wallets' , walletRoutes);
app.use('/v1/rewards' , rewardRoutes);


pool.connect()
  .then(() => console.log('Connected to PostgreSQL successfully!'))
  .catch(err => console.error(' Database connection error:', err.message));


app.get('/', (req, res) => {
  res.send('Hello! from Node.js app');
});

// Test Database Route
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      success: true,
      message: 'Database is working!',
      time: result.rows[0].current_time
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/test', (req, res) => {
  res.send('Testing');
});




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});