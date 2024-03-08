const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookie = require('cookie-parser');

const server = express();

server.set('view engine', 'pug');   
server.set('views', path.join(__dirname, 'views'));
server.set('port', process.env.PORT || 4000);

server.use(cookie());
const corsOptions = {credentials: true, origin: 'http://192.168.1.118:3001'};
server.use(cors(corsOptions));

server.use(morgan('dev'));
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.json());
server.use(require('./routes/apiConnectionRoutes.js'));

module.exports = server;