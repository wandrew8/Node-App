const express = require('express');
const bodyParser = require('body-parser');
const Photo = require('../models/photo');
const User = require('../models/user');
const authenticate = require('../authenticate');


const photoRouter = express.Router();

photoRouter.use(bodyParser.json());

photoRouter.get('/', (req, res, next) => {
    Photo.find()
    .then(photos => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photos)
    })
    .catch(err => next(err));
})

photoRouter.post('/', (req, res) => {
    Photo.create(req.body)
    .then(photo => {
        console.log('Photo Created ', photo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo)
    })
    .catch(err => next(err))
})
photoRouter.put('/', (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /photos');
})
photoRouter.delete('/', (req, res, next) => {
    Photo.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

photoRouter.get('/:photoId', (req, res, next) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})
photoRouter.post('/:photoId',(req, res) => {
    Photo.create(req.body)
    .then(photo => {
        console.log('Photo Created ', photo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo)
    })
    .catch(err => next(err))
})
photoRouter.put('/:photoId',(req, res, next) => {
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
photoRouter.delete('/:photoId',(req, res, next) => {
    Photo.deleteOne({ "_id": req.params.photoId })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));

});

photoRouter.get('/category/:category', (req, res, next) => {
    Photo.find({ "category": req.params.category })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
});

photoRouter.get('/search/:query', (req, res, next) => {
    Photo.find({ "tags": req.params.query })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})

module.exports = photoRouter;