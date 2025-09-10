const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRouter');
const propertyRoutes = require('./routes/propertyRoute');

app.use(morgan('dev'));


app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);


module.exports = app;