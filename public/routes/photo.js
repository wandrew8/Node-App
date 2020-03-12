const express = require('express');
const bodyParser = require('body-parser');

const photoRouter = express.Router();

photoRouter.use(bodyParser.json());

photoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send photo with id ${req.body.photoId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /photo');
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /photo');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /photo');
});

module.exports = photoRouter;