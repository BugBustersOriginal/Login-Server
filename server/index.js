require('dotenv').config();
const app = require('./app.js');

app.listen(process.env.port, () => {
  console.log(`Login-Server is listening on ${process.env.port}`);
});