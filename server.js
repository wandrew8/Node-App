const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const photoRouter = require('./routes/photoRouter');


const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/photos', photoRouter);

app.use((req, res) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type', 'text/html');
    res.sendFile('./public/index.html');
});


//Connect to mongodb server
const url = 'mongodb://localhost:27017/pixelimages';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

//connect to application server
const hostname = 'localhost';
const port = 3000;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}${port}`)
})