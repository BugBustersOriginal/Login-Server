const db = require('../../database');
const utils = require('../lib/hashUtils');

//create a user in users db
const createUser = async ({firstname, lastname, username, password, address1, address2, city, state, country, zipcode, photo}) => {
  const client = await db.connect();
  let options = {firstname, lastname, username, password, address1, address2, city, state, country, zipcode, photo};
  let salt = utils.createRandom32String();
  let passwordHashed = utils.createHash(options.password, salt);

  let newUser = [options.firstname, options.lastname, options.username, passwordHashed, salt, options.photo, options.address1, options.address2, options.city, options.state, options.country, options.zipcode]

  const query = {
    text: 'INSERT INTO users(firstname, lastname, username, password, salt, avatar_url, address1, address2, city, state, country, zipcode) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
    values: newUser
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
//compare password
const comparePassword = (actual, passwordHashed, salt) => {
  return passwordHashed === utils.createHash(actual, salt);

};



//update change password or update password
const updatePassward = () => {

};


module.exports = {createUser, getUser, comparePassword, updatePassward}