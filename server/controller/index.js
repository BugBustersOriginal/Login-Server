const {createUser, getUser, comparePassword} = require('../model')

const getSignUp = (req, res) => {
  //render signup page
  res.send('should render signup page');
};


/*****  by username and password to sign up *******/
const postSignUp = async (req, res) => {

  // check request has both username and password
  if (req.body.username === undefined || req.body.password === undefined) {
    res.send('should input both username and password, redirect to signup page');
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
  console.log(req.session)
  if (req.session.userId ) {
    res.send(`hello, userId=${req.session.userId}`)
  } else {
    //render login page
    res.send('should render login page')

  }

};

const postLogIn = async (req, res) => {
  //check users first login or has session in request
  //no userid in req.session, first login or cookie expired
  if (req.session.userId === undefined) {
    // username and password all filled in
    if (req.body.username === undefined || req.body.password === undefined) {
      res.send('should input both username and password,redirect to login page');
    } else {
      let {username, password} = req.body;
      let findUser = await getUser({username});
      if (findUser === null) {
        //user not exist in db users, redirect to signup page
        res.send('new user, redirect to signup page');
      } else {
        //exist user, compare password in db
        let salt = findUser.salt;
        let passwordHashed = findUser.password;
        if (comparePassword(req.body.password, passwordHashed, salt)) {
          //password correct, assign a new session and save sessionid into cookie
          let userId = findUser.id;
          req.session.userId = userId;
          // Wait for the session data to be saved to the database
          await new Promise((resolve, reject) => {
            req.session.save((err) => {
              if (err) {
                reject(err);
              } else {

                resolve(console.log('set session success'));
              }
            });
          });
          //check if avatar and address is empty
          if (findUser.avatar_id === null || findUser.zipcode === null || findUser.country === null) {
            res.send('password correct, redirct to settings page')
          } else {
            //render to app main page
            res.send('render app main page')
          }
        } else {
          //user exist, password not correct, redirect to login page
          res.send('password incorrect, redirect to login page');
        }
      }
    }
  } else {
    res.send('exist user, render app main page')
  }




  //first login successnot have cookie and session or cookie expire




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