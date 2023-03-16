require('dotenv').config();
/******** for https request */
// const https = require('https');
// const fs = require('fs');
// const path = require('path');

const app = require('./app.js');


/*****  Load SSL/TLS certificate and key ****/
// const options = {
//   key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
//   cert: fs.readFileSync(path.resolve(__dirname,'../cert.pem'))
// };
/******  Create HTTPS server *****/
// const server = https.createServer(options, app);

// server.listen(process.env.port, () => {
//   console.log(`Login-Server is listening on ${process.env.port}`);
// });

app.listen(process.env.port, () => {
    console.log(`Login-Server is listening on ${process.env.port}`);
  });
