const app = require('./app.js');
const db = require('../database/index.js');
require('dotenv').config();
app.listen(process.env.port, () => {
  console.log(`Login-Server is listening on ${process.env.port}`);
});