require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const {getSignUp, postSignUp, getLogIn, postLogIn, forgetPassword, getSettings, changePassword,getLogOut, getGmailAuth} = require('./controller/index.js');
const pgPool = require('../database/index.js');

//create http to https middleware
// function redirectToHttps(req, res, next) {
//   if (req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect(`https://${req.hostname}${req.url}`);
//   }
//   return next();
// }
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use redirectToHttps as middleware
// app.use(redirectToHttps);

//use connect-pg-simple to create session
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
  }),
  secret: process.env.FOO_COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge:   60 * 1000 } // 1min
}));

app.get('/signup', getSignUp );
app.post('/signup', postSignUp);
app.get('/login', getLogIn);
app.post('/login',postLogIn);
app.get('/forgetPassword', forgetPassword);
// app.post('/forgetPassword', updatePassword);

app.get('/settings', getSettings);
app.post('/changePassword', changePassword);

app.get('/logout', getLogOut);
app.get('/gmailAuth', getGmailAuth)



module.exports = app;