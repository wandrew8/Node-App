const express = require('express');
const User = require('../models/user');
const cors = require('./cors');
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
              const token = authenticate.getToken({_id: req.user._id});
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, token: token, userId: req.user._id, status: 'Registration Successful, you are logged in'})
            });
          })
        }
      }
    )
  });

userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  const token = authenticate.getToken({_id: req.user._id});
  const userId = req.user._id
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, userId: userId, token: token, status: 'You are successfully logged in!'})
  .catch(err => next(err))
})

userRouter.get('/logout', (req, res, next) => {
  console.log(req.body)
    req.logOut()
    res.redirect('/')
    res.end('Hello')
  .catch(err => next(err))
  
})

userRouter.get('/:userId', (req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err));
})
userRouter.post('/:userId', (req, res) => {
    User.create(req.body)
    .then(user => {
        console.log('User Created ', user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user)
    })
    .catch(err => next(err))
})
userRouter.put('/:userId', (req, res, next) => {
    User.findByIdAndUpdate(req.params.userId, {
        $set: req.body
    }, { new: true })
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err));
})
userRouter.delete('/:userId', (req, res, next) => {
    User.deleteOne({ "_id": req.params.userId })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));

});

//GETTING PHOTOS BY FAVORITES
userRouter.route('/:userId/favorites')
.get(cors.cors, (req, res, next) => {
  User.findById(req.params.userId)
  .populate('favorites')
  .then(user => {
    if (user) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user.favorites);
    } else {
        err = new Error(`user ${req.params.userId} not found`);
        err.status = 404;
        return next(err);
    }
})
.catch(err => next(err));
})
.post(cors.cors, (req, res) => {
  User.findById(req.params.userId)
  .then(user => {
    if(user) {
      user.favorites.push(req.body);
      user.save()
      .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      })
      .catch(err => next(err));
    } else {
      err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err))
})
.delete(cors.cors, (req, res, next) => {
  User.findById(req.params.userId)
  .then(user => {
    if(user) {
      for (let i = (user.favorites.length); i >= 0; i--) {
        user.favorites.id(user.favorites[i]._id).remove();
      }
      user.save()
      .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user)
      })
      .catch(err => next(err));
    } else {
      err = new Error('User not found');
      err.status = 404;
      return next(err)
    }
  })
  .catch(err => next(err));

});

userRouter.route('/:userId/favorites/:photoId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.delete(cors.cors, (req, res, next) => {
  User.findById(req.params.userId)
  .then(user => {
      const index = user.favorites.indexOf(req.params.photoId)
      if(index > -1) {
        user.favorites.splice(index, 1);
      }
      user.save()
      .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user)
      })
      .catch(err => next(err));
    })
});

//GETTING PHOTOS BY CATEGORIES
userRouter.get('/category/:category', (req, res, next) => {
    User.find({ "category": req.params.category })
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err));
});

//GETTTING PHOTOS BY SEARCH QUERY
userRouter.route('/search/:query')
.get(authenticate.verifyUser, (req, res, next) => {
    User.find({ "tags": req.params.query })
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err));
})

module.exports = userRouter;