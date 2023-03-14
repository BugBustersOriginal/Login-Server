const express = require('express');
const {getSignUp, postSignUp,getLogIn,postLogIn,getLogOut,getGmailAuth} = require('./controller/index.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/signup', getSignUp );
app.post('/signup', postSignUp);
app.get('/login', getLogIn);
app.post('/login',postLogIn);
app.get('/logout', getLogOut);
app.get('/gmailAuth', getGmailAuth)



module.exports = app;