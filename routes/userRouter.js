const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const userRouter = express.Router();


userRouter.get('/', (req, res, next) => {
    User.find()
    .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
    })
    .catch(err => next(err));
})
userRouter.delete('/', (req, res, next) => {
    User.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
})
userRouter.post('/signup', (req, res, next) => {
    User.register(
      new User({username: req.body.username}),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        } else {
          if (req.body.firstName) {
            user.firstName = req.body.firstName;
          }
          if (req.body.lastName) {
            user.lastName = req.body.lastName;
          }
          if (req.body.userImage) {
            user.userImage = req.body.userImage;
          }
          user.save(err => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
              return;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Registration Successful'})
            });
          })
        }
      }
    )
  });

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

userRouter.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  } else {
    const err = new Error('You are not logged in');
    err.status = 401;
    return next(err);
  }
})

userRouter.get('/:photoId', (req, res, next) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})
userRouter.post('/:photoId', (req, res) => {
    Photo.create(req.body)
    .then(photo => {
        console.log('Photo Created ', photo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo)
    })
    .catch(err => next(err))
})
userRouter.put('/:photoId', (req, res, next) => {
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
userRouter.delete('/:photoId', (req, res, next) => {
    Photo.deleteOne({ "_id": req.params.photoId })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));

});

userRouter.get('/category/:category', (req, res, next) => {
    Photo.find({ "category": req.params.category })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
});

userRouter.route('/search/:query')
.get(authenticate.verifyUser, (req, res, next) => {
    Photo.find({ "tags": req.params.query })
    .then(photo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(photo);
    })
    .catch(err => next(err));
})

module.exports = userRouter;