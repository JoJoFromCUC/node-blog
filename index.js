const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const MongoStore = require('connect-mongo')(session);
const routes = require('./routes');

const app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongodb
  })
}));

app.use(flash());
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname,'public/img'),
  keepExtensions: true,
}));
app.locals.blog = {
  title: 'hello',
  description: 'the first post'
};
app.use(function(req,res,next){
  res.locals.user = req.session.user;//req.session.user;
  res.locals.success = req.flash('success').toString(); //req.flash('success').toString();
  res.locals.error = req.flash('error').toString(); //req.flash('error').toString();
  next();
});
routes(app);
app.listen(config.port,function(){
  console.log(`app listening on port ${config.port}`);
});
