const cors = require('cors');

const whitelist = ['http://localhost:3001/', 'https://pixelimages.herokuapp.com/', 'http://localhost:3000', "https://quiet-ravine-27369.herokuapp.com"];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
exports.consoleLog = (res, req) => {console.log(res, req)};
exports.cors = cors({origin: false});
exports.corsWithOptions = cors(corsOptionsDelegate);