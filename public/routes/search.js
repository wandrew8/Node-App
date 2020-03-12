const express = require('express');
const bodyParser = require('body-parser');


const searchRouter = express.Router();

searchRouter.use(bodyParser.json());

searchRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send results of search query ${req.body.searchQuery}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /search');
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /search');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /search');
});

module.exports = searchRouter;