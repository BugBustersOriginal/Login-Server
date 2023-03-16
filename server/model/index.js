const db = require('../../database');
const utils = require('../lib/hashUtils');

//create a user in users db
const createUser = async ({username, password}) => {
  const client = await db.connect();
  let salt = utils.createRandom32String();
  let newUser = {
    username,
    salt,
    password: utils.createHash(password, salt)
  };
  const query = {
    text: 'INSERT INTO users(username, password, salt) VALUES($1, $2, $3) RETURNING *',
    values: [newUser.username, newUser.password, newUser.salt]
  };
  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch(err) {
    console.log('create user error', err);
  } finally {
    client.release();
  }
};
//find a user in users db
const getUser = async ({username}) => {
  const client = await db.connect();
  let queryValue = {username};
  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [queryValue.username],
  };
  try {
    const result = await db.query(query);
    if (result.rowCount === 0) {
      return null; //no record is found
    }
    return result.rows[0];
  } catch(err) {
    console.log('get user error', err.stack);
  } finally {
    client.release();
  }

};

//update a user in users db
const updatePassward = () => {

};

const updateAddress = () => {

};
const updateAvatorId = () => {

};

//create avator
const addAvator = () => {

};

//create session
const addSession = () => {

};

//update session
const updateSession = () => {

};

//delete session
const deleteSession = () => {

};

//find session
const getSession = () => {

};
module.exports = {createUser, getUser}