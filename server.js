const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const index = require('./index');
const connectDb = require ('./config/connectDb');

require('dotenv').config();

const app = express();

connectDb();

// Enable JSON body parsing
app.use(express.json());
// Use the index router for all API routes
app.use('/api', index);
// Enable Helmet middleware for security
app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on:${process.env.PORT}`);
});