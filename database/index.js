const { Pool } = require('pg');
const uuid = require('pg-uuid');

const pool = new Pool({
  user: 'vaan',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432,
});

(async () => {
  const client = await pool.connect();
  try {
    //create avator table to save users icon
    const createAvatarQuery = `
    CREATE TABLE IF NOT EXISTS avatar (
      id SERIAL PRIMARY KEY,
      url VARCHAR(255)
    )`;
    await client.query(createAvatarQuery);
    console.log('avatar created successfully');

    //create user table to save users account and address
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    const createUsersQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) UNIQUE,
        password VARCHAR(64),
        salt VARCHAR(64),
        google_id VARCHAR(255) UNIQUE,
        create_at TIMESTAMP NOT NULL DEFAULT NOW(),
        avatar_id INTEGER,
        address1 TEXT,
        address2 TEXT,
        country VARCHAR(20),
        zipcode VARCHAR(10),
        FOREIGN KEY (avatar_id) REFERENCES avatar(id)
      )
    `;
    await client.query(createUsersQuery);
    console.log('users created successfully');

    //create session table to authication
    const createSessionQuery = `
    CREATE TABLE IF NOT EXISTS session  (
      sid VARCHAR(255) NOT NULL PRIMARY KEY,
      sess JSON NOT NULL,
      expire TIMESTAMP(6) NOT NULL
    )
    WITH (OIDS=FALSE);`;
    await client.query(createSessionQuery);
    console.log('session created successfully');

  } catch (err) {
    console.error('Error creating table', err);
  }
  finally {
    client.release();
    // pool.end();
  }
})();

module.exports = pool;





