const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const photoRouter = require('./routes/photoRouter');
const userRouter = require('./routes/userRouter');
require('dotenv').config()


const app = express();
app.use(cors({
    // origin: 'http://localhost:3001',
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/photos', photoRouter);
app.use('/users', userRouter);
        app.use('/', (req, res) => {
            res.statusMessage = 200;
            res.end('Hello')
        });

console.log(process.env.DATABASE)
//Connect to mongodb server
const connect = mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

//connect to application server
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});