const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
require('dotenv').config()

const cors = require('cors');
const indexRouter = require('./routes/indexRouter');
const photoRouter = require('./routes/photoRouter');
const userRouter = require('./routes/userRouter');
// const mongoDB = "mongodb://localhost:27017/pixelimages"
console.log(require('dotenv').config())

const app = express();
const mongoose = require('mongoose');
app.use(cors({
    origin: 'http://localhost:3001',
}));
const connect = mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/photos', photoRouter);

       
//connect to application server
app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
//   error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
      });
  });
  