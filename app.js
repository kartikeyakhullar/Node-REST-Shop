const express = require('express');
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const keys = require('./config/keys')


const app = express();

mongoose.connect(keys.mongodb.dbURI,()=>{
    console.log('Connected to the database...');
})

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,GET,DELETE');
        return res.status(200).json({});
    }
    next();
})

// Handling the routes.
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user', userRoutes);

// Handling Errors
app.use((req,res,next)=>{
    console.log('Hitting the 1st function...');
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    console.log('Hitting the 2nd function...');
    res.status(error.status || 500).json({
        error : {
            message : error.message
        }
    });
})

module.exports = app;