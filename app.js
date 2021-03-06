const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
const driver = require('./neo4j')
mongoose.promise = global.Promise;
mongoose.set('useCreateIndex', true)
mongoose.connect("mongodb://system:system1@ds245170.mlab.com:45170/locality",{ useNewUrlParser: true });
useMongoClient: true 
//Neo4j


const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const PORT = process.env.PORT || 5000;
const IP = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'LightBlog', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
const passport = require('passport');
// Add models
// require('./models/Orders');
require('./models/Comments');
require('./models/PostLikes');
require('./models/PlaceLikes');
require('./models/Places')
require('./models/Saved');
require('./models/Posts');
require('./models/Users');
require('./models/Review');
require('./passport')(passport);
// Add routes
app.use(require('./routes'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});



const server = app.listen(PORT,() => console.log(`Locality is running, port :${PORT}`));
