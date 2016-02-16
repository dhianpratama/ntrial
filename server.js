// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 3333; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var io = require('./business-logic/socket').listen(http)
var passport = require('passport');

//var socketHandler = require('./business-logic/socket');

// configuration ===============================================================
mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

require('./business-logic/passport-strategy')(passport);

//		// set the static files location /public/img will be /img for users
app.use(express.static(__dirname));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

var sessionOpts = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    secret: 'thisisforjiggietest',
    cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
};
app.use(expressSession(sessionOpts));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Middle ware function
app.use(function(req,res,next){
    next();
});

// routes ======================================================================
require('./app/routes.js')(app);

var api = require('./app/api')(passport);
app.use('/api', api);

//io.on('connection', require('./business-logic/chat-socket'));

//require('./business-logic/socket').listen(app)
// listen (start app with node server.js) ======================================
http.listen(port);
console.log("App listening on port " + port);

module.exports = io;
