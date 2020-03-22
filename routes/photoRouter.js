const express = require('express');
const bodyParser = require('body-parser');
const Photo = require('../models/photo');

const photoRouter = express.Router();

photoRouter.use(bodyParser.json());

photoRouter.route('/')
.get((req, res, next) => {
    Photo.find()
    .then(photos => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photos)
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
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /photos');
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

photoRouter.route('/:photoId')
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

photoRouter.route('/category/:category')
.get((req, res, next) => {
    Photo.find({ "category": req.params.category })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})

module.exports = photoRouter;