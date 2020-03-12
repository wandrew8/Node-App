const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const favoritesRouter = require('./public/routes/favorites');
const photoRouter = require('./public/routes/photo');
const searchRouter = require('./public/routes/search');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/favorites', favoritesRouter);
app.use('/photo', photoRouter);
app.use('/search', searchRouter);

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
    res.statusMessage = 200;
    res.setHeader('Content-Type', 'text/html');
    res.send('<html><body><h1>This is an Express Server</h1></body></html>');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}${port}`)
})