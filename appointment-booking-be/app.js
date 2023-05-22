const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

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


mongoose.connect("mongodb+srv://renishkar47:renishkar47@cluster0.k0umtmk.mongodb.net/AarogProject")
    .then(res => {
        app.listen(8080);
    })
    .catch(err => console.log(err));