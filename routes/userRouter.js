const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.route('/')
.get((req, res, next) => {
    User.find()
    .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
    })
    .catch(err => next(err));
})
.post((req, res) => {
    User.create(req.body)
    .then(user => {
        console.log('New User Added' + user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user)
    })
    .catch(err => next(err))
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /users');
})
.delete((req, res, next) => {
    Photo.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

userRouter.route('/:photoId')
.get((req, res, next) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    Photo.create(req.body)
    .then(photo => {
        console.log('Photo Created ', photo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo)
    })
    .catch(err => next(err))
})
.put((req, res, next) => {
    Photo.findByIdAndUpdate(req.params.photoId, {
        $set: req.body
    }, { new: true })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Photo.deleteOne({ "_id": req.params.photoId })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));

});

userRouter.route('/category/:category')
.get((req, res, next) => {
    Photo.find({ "category": req.params.category })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
});

userRouter.route('/search/:query')
.get((req, res, next) => {
    Photo.find({ "tags": req.params.query })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})

module.exports = userRouter;