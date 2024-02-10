const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Passport config
require('./config/passport')(passport);


const app = express();

//Database config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db)
.then( () => console.log('Mongo DB connected'))
.catch(err => console.log('There is an error'));

// EJS and Express layouts middleware
app.use(expressLayouts);
app.set("view engine", 'ejs');

// Express Body parsrer
app.use(express.urlencoded( { extended : true}));

// Express Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(flash());

//Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
