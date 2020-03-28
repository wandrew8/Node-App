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

userRouter.get('/category/:category', (req, res, next) => {
    User.find({ "category": req.params.category })
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch(err => next(err));
});

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