const express = require('express');
const bodyParser = require('body-parser');
const Photo = require('../models/photo');
const authenticate = require('../authenticate');


const photoRouter = express.Router();

photoRouter.use(bodyParser.json());

photoRouter.get('/', (req, res, next) => {
    Photo.find()
    .populate('author')
    .then(photos => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photos)
    })
    .catch(err => next(err));
})

photoRouter.route('/')
.post(authenticate.verifyUser,  (req, res) => {
    Photo.create(req.body)
    .then(photo => {
        if (photo) {
            console.log("This is the photo" + photo)
            photo.author.push(req.user._id);
            photo.save()
            .then(photo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photo);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`photo ${req.params.photoId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err))
})
photoRouter.route('/')
.put(authenticate.verifyUser, (req, res) => {
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
    .populate('author')
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})
photoRouter.route('/:photoId')
.post(authenticate.verifyUser, (req, res) => {
    Photo.create(req.body)
    .then(photo => {
        console.log('Photo Created ', photo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo)
    })
    .catch(err => next(err))
})
photoRouter.route('/:photoId')
.post(authenticate.verifyUser, (req, res, next) => {
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
photoRouter.route('/:photoId')
.delete(authenticate.verifyUser, (req, res, next) => {
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
    .populate('author')
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
});

photoRouter.get('/search/:query', (req, res, next) => {
    Photo.find({ "tags": req.params.query })
    .populate('author')
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})

module.exports = photoRouter;