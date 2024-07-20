// ----------------ALL ROUTERS---------------------

const express = require('express');
const app = express();
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.port || 11000;
const user = require('./router/user');
const admin = require('./router/admin');
const category = require('./router/category');
const product = require('./router/product');
const order = require('./router/order');
const cors = require('cors');
app.use(cors());

// ----------------DATABASE CONNECTION---------------------

mongo.connect('mongodb://localhost:27017/testdb').
    then(() => console.log("DB Connected!!")).
    catch((err) => console.log({ "Error": err }));

app.use(bodyParser.json());

app.use('/api/v1', user);
app.use('/api/v2', admin);
app.use('/api/v3', category);
app.use('/api/v4', product);
app.use('/api/v5', order);

// ----------------SERVER CONNECTION---------------------

app.listen(port, () => console.log("Server Created !!"));