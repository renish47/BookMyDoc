const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv').config();

const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');

const app = express();

app.use(bodyParser.json());
mongoose.set('strictQuery', false);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


app.use('/doctor', doctorRouter);
app.use('/patient', patientRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data});
  });


mongoose.connect(process.env.MONGODB_URI)
    .then(res => {
        app.listen(process.env.PORT);
    })
    .catch(err => console.log(err));
