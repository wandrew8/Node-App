const express = require('express');
const bodyParser = require('body-parser');

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the favorited photos');
})
.post((req, res) => {
    res.end(`Will add the photo: ${req.body.photoId} to favorites`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete((req, res) => {
    res.end(`Will remove the photo with id ${req.body.photoId} from favorites`);
});

module.exports = favoritesRouter;