const {createUser, getUser, getUserById, updatePassward} = require('../model')
const {compareHash} = require('../lib/hashUtils.js')

/*****  by username and password to sign up *******/
// const getSignUp = (req, res) => {
//   //render signup page
//   res.send('should render signup page');
// };

const postSignUp = async (req, res) => {
/*dummy data
{
  firstname: 'debra',
  lastname: 'zhang',
  username: 'debrazhang',
  password: 1234,
  address1: 'optional',
  address2: 'optional',
  city: 'optional',
  state: 'optinal',
  country: 'US',
  zipcode: 94538,
  photo: 'https://as2.ftcdn.net/v2/jpg/03/03/62/45/1000_F_303624505_u0bFT1Rnoj8CMUSs8wMCwoKlnWlh5Jiq.jpg'
}

*/
  // console.log('integration register test',req.body);

  // if photo is undefined, give a default photo
  if (req.body.photo === undefined) {
    req.body.photo = 'https://as2.ftcdn.net/v2/jpg/03/03/62/45/1000_F_303624505_u0bFT1Rnoj8CMUSs8wMCwoKlnWlh5Jiq.jpg';
  }
  // check request has both username and password
  if (req.body.username === undefined || req.body.password === undefined) {
    res.send({
      'reminder':'should input both username and password, redirect to signup page',
      'url':'/register'
    });
  }
  const {username} = req.body;

  try {
    let findUser = await getUser({username});
    if (findUser === null) {
      //new user,send body data into createUser function
     let addUser = await createUser(req.body);

     //render login page, can it go direct into main page?
     res.send({
      'reminder': 'signup success, should render login page',
      'url':'/login'
    });
    } else {
     //user exist, render signup page
     res.send({
      'reminder': 'alert user that username exist, if want to login please move to login page, or get a new username, rerender signup page',
      'alert': `${req.body.username} exist, get a new username or go to login `,
      'url':'/register'
     });
    }
  } catch (err) {
    console.log('signup error', err);
  }
};

const getLogIn = (req, res) => {
  if (req.session.userId ) {
    res.send({
      'reminder':`hello, userId=${req.session.userId}`,
      'url':`/home?userId=${userId}`
  })
  } else {
    //render login page
    res.send({
      'reminder':'should render login page',
      'url':'/login'
    })

  }

};

const postLogIn = async (req, res) => {
  //check users first login or has session in request
  //no userid in req.session, first login or cookie expired
  if (req.session.userId === undefined) {
    // username and password all filled in
    if (req.body.username === undefined || req.body.password === undefined) {
      res.send({
        'reminder': 'should input both username and password,redirect to login page',
        'url': '/login'
      });
    } else {
      let {username, password} = req.body;
      let findUser = await getUser({username});
      if (findUser === null) {
        //user not exist in db users, redirect to signup page
        res.send({
          'reminder':'new user, redirect to signup page',
          'url':'/register',
          'alert':`${req.body.username} is a new user, register first`
        });
      } else {
        //exist user, compare password in db
        let salt = findUser.salt;
        let passwordHashed = findUser.password;
        if (compareHash(req.body.password, passwordHashed, salt)) {
          //password correct, assign a new session and save sessionid into cookie
          let userId = findUser.id;
          req.session.userId = userId;
          // Wait for the session data to be saved to the database
          await new Promise((resolve, reject) => {
            req.session.save((err) => {
              if (err) {
                reject(err);
              } else {
                resolve(console.log(`set session success, userId=${userId}`));
              }
            });
          });
          //render to app main page
          res.send({
            'reminder': 'seesion set success, render app main page',
            'url':`/home?userId=${userId}`
          })
        } else {
          //user exist, password not correct, redirect to login page
          res.send({
            'reminder': 'password incorrect, redirect to login page',
            'url':'/login',
            'alert':'password incorrect'
          });
        }
      }
    }
  } else {
    res.send({
      'reminder':'exist user, render app main page',
      'url':`/home?userId=${req.session.userId}`
    })
  }
};



//render forget password page
const passwordPage = (req, res) => {
  res.send('should render forget password page');

};

//part1 way: forget password then get firstname and lastname and username, use these to find user and update new password
//part 2: username set as email, then send link to email for change password
const forgetPassword = async (req, res) => {
  //part1 way:
  //suppose req.body = {username: "debrazhang", firstname: "debra", lastname:"zhang", newPassword: ""}
  if (!req.body.username || !req.body.firstname || !req.body.lastname) {
    res.send('input should has username, firstname and lastname, render forgetPassword page');
    return;
  }
  let findUser = await getUser({username: req.body.username});
  if (findUser === null) {
    //user not exist in db users, redirect to signup page
    res.send('new user, redirect to signup page');
  } else {
    //check firstname and lastname is correct
    if (findUser.firstname === req.body.firstname && findUser.lastname === req.body.lastname) {
      //vertify success
      if (!req.body.newPassword) {
        res.send('input should have newPassword, render forgetPassword page')
        return;
      }
      await updatePassward(findUser.id, req.body.newPassword);
      console.log('set new password success');
      res.send('set new password success, render login page');

    } else {
      res.send('verity wrong, render login page');
   }


  }
};


//render setting page
const getSettings = (req, res) => {
  res.send('rend settings page');
};

//change password in settings(userId exist in db)
const changePassword = async (req, res) => {
  //suppose req.url has userId,
  //request has the origin password and new password
  //req.body = {originPassword: '', newPassword: ''};

  //must input a new password
  if (req.body.newPassword === undefined ) {
    res.send('new password is empty, render change password page')
  }
  //mock userId
  let userId = '4cf032b6-bf19-4fbd-bbca-aa677122c225';
  let user = await getUserById({id: userId});
  if (compareHash(req.body.originPassword, user.password, user.salt)) {
    //password correct, change with new password with the previous salt
    await updatePassward(userId, req.body.newPassword);
    res.send('change password successfully');
  } else {
    res.send('password wrong, rerender changePassword page');
  }
};

const getLogOut = async(req, res) => {
  const userId  = req.session.userId;
  req.session.destroy();
  res.clearCookie('connect.sid');
  console.log(`userId=${userId} delete success`);
  res.send({
    'reminder':'render login page',
    'url':'/login'
  });

};


//not implement yet
const getGmailAuth = (req, res) => {

};

module.exports = { postSignUp, getLogIn, postLogIn, passwordPage,forgetPassword, getSettings, changePassword, getLogOut, getGmailAuth};
