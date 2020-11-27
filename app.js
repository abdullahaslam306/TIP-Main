const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const indexRoutes = require('./routes/indexRoutes');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3900;
const env = require('./config/env');
// express app
const app = express();

mongoose.connect(env.dburi,{useNewUrlParser:true,useUnifiedTopology : true,useFindAndModify: false })
.then((result) => {
  app.listen(PORT);
  console.log('Connection established to Database.');
})
.catch((err) => {
  console.log(err);
});
// listen for requests

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(session({
  cookie:{
  maxAge: 30 * 86400 * 1000,
  sameSite: true,
  secure: env.environment === 'production',
  },
  name : env.SESSION_NAME,
  resave : false,
  saveUninitialized : false,
  secret: env.SESSION_SECRET,
}));


app.use('/',indexRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { fname: '404',lname:'Page' });
});
