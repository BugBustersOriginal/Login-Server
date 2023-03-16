const {createUser, getUser} = require('../model')

const getSignUp = (req, res) => {
  //render signup page
  res.send('should render signup page');
};


/*****  by username and password to sign up *******/
const postSignUp = async (req, res) => {

  // check request has both username and password
  if (req.body.username === undefined || req.body.password === undefined) {
    console.log('should input both username and password');
    res.send('redirect to signup page');
  }
  const {username, password} = req.body;

  try {
    let findUser = await getUser({username});
    if (findUser === null) {
      //new user
     let addUser = await createUser({username, password});

     //render login page
     res.send('signup success, should render login page');
    } else {
     //user exist, render signup page
     res.send('alert user that username exist, if want to login please move to login page, or get a new username, rerender signup page');
    }
  } catch (err) {
    console.log('signup error', err);
  }
};
const getLogIn = (req, res) => {
  res.send('should render login page')

};

const postLogIn = (req, res) => {


};

const postAddress = (req, res) => {

};
const postAvator = (req, res) => {

};
const forgetOrChangePassword = (req, res) => {

};

const getLogOut = (req, res) => {

};
const getGmailAuth = (req, res) => {

};
module.exports = {getSignUp, postSignUp, getLogIn, postLogIn, getLogOut, getGmailAuth};