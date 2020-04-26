const express = require('express');
const bodyParser = require('body-parser');
const Photo = require('../models/photo');
const authenticate = require('../authenticate');
const cors = require('./cors');


const photoRouter = express.Router();

photoRouter.use(bodyParser.json());


photoRouter
.get("/", (req, res, next) => {   
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
.post((req, res) => {
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
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /photos');
})
photoRouter.delete('/', cors.corsWithOptions, authenticate.verifyAdmin,(req, res, next) => {
    Photo.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

photoRouter.route('/:photoId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Photo.findById(req.params.photoId)
    .populate('author')
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported`);
})
.put(cors.corsWithOptions, (req, res, next) => {
    Photo.findByIdAndUpdate(req.params.photoId, {
        $inc: {likes: 1}
    }, { new: true })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})
.delete(cors.cors, (req, res, next) => {
    Photo.deleteOne({ "_id": req.params.photoId })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));

});
photoRouter.put('/:photoId/update', function(req, res, next) {
    Photo.findByIdAndUpdate(req.params.photoId, req.body, function (err, photo) {
     if (err) return next(err);
     res.json(photo);
    });
});


//COMMENT ROUTES

photoRouter.route('/:photoId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Photo.findById(req.params.photoId)
    .populate('comments.author')
    .then(photo => {
        if (photo) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(photo.comments);
        } else {
            err = new Error(`photo ${req.params.photoId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.cors, (req, res, next) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        if (photo) {
            photo.comments.push(req.body);
            photo.save()
            .then(photo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photo);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Photo ${req.params.photoId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        if (photo) {
            for (let i = (photo.comments.length-1); i >= 0; i--) {
                photo.comments.id(photo.comments[i]._id).remove();
            }
            photo.save()
            .then(photo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photo);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Photo ${req.params.photoId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

photoRouter.route('/:photoId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.put(cors.cors, (req, res, next) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        if (photo && photo.comments.id(req.params.commentId)) {
            if (req.body.text) {
                photo.comments.id(req.params.commentId).text = req.body.text;
            }
            if (req.body.likes) {
                photo.comments.id(req.params.commentId).likes = req.body.likes;
            }
            if (req.body.dislikes) {
                photo.comments.id(req.params.commentId).dislikes = req.body.dislikes;
            }
            photo.save()
            .then(photo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photo);
            })
            .catch(err => next(err));
           
        } else if (!photo) {
            err = new Error(`Photo ${req.params.photoId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        if (photo && photo.comments.id(req.params.commentId)) {
            if (photo.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
            photo.comments.id(req.params.commentId).remove();
            photo.save()
            .then(photo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photo);
            })
            .catch(err => next(err));
        } else {
            res.statusCode = 403;
            res.end('Only the author can delete this comment');
        }
        } else if (!photo) {
            err = new Error(`Photo ${req.params.photoId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

photoRouter.route('/author/:authorId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Photo.find({"author": req.params.authorId})
    .populate('author')
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})

photoRouter.route('/category/:category')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Photo.find({ "category": req.params.category })
    .populate('author')
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
});

photoRouter.route('/search/:query')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
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