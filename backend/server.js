require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/home', require('./routes/home.routes'));
app.use('/api/movies', require('./routes/movie.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
