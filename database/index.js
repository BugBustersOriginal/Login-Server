const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});
client.connect();

client.query('CREATE SCHEMA myschema;', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Schema created successfully');
  }
  client.end();
});