const {createUser, getUser} = require('../model')

const getSignUp = (req, res) => {
  //render signup page
  res.send('should render signup page');
};
const postSignUp = async (req, res) => {
  const {username, password} = req.body;
  console.log('see if cookie and session exist', req.cookie, req.session)
  try {
    let findUser = await getUser({username});
    if (findUser === null) {
      //new user
     let addUser = await createUser({username, password});
     //connect session

     //render app inner page
     res.send('signup success, should render app inner page');
    } else {
     //user exist, render signup page
     res.send('alert user that username exist,if want to login please move to login page, or get a new username, rerender signup page');
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
const getLogOut = (req, res) => {

};
const getGmailAuth = (req, res) => {

};
module.exports = {getSignUp, postSignUp, getLogIn, postLogIn, getLogOut, getGmailAuth};