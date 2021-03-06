const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const MongoStore = require('connect-mongo')(session);
const routes = require('./routes');
const winston = require('winston');
const expressWinston = require('express-winston');

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
  title: '生花',
  description: '以梦为马  以笔为缰'
};
app.use(function(req,res,next){
  res.locals.user = req.session.user;//req.session.user;
  res.locals.success = req.flash('success').toString(); //req.flash('success').toString();
  res.locals.error = req.flash('error').toString(); //req.flash('error').toString();
  next();
});
//normal req logger
// app.use(expressWinston.Logger({
//   transports:[
//     new (winston.transports.Console)({
//       json: true,
//       colorize: true
//     }),
//     new (winston.transports.File)({
//       filename: 'logs/success.log'
//     })
//   ]
// }))

routes(app);

// error req logger
// app.use(expressWinston.errorLogger({
//   transports:[
//     new (winston.transports.Console)({
//       json: true,
//       colorize: true
//     }),
//     new (winston.transports.File)({
//       filename: 'logs/error.log'
//     })
//   ]
// }))

app.use(function(err,req,res,next){
  console.error(err);
  req.flash('error'.err.message);
  res.redirect('/posts');
})
app.listen(config.port,function(){
  console.log(`app listening on port ${config.port}`);
});
