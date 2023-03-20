require('dotenv').config();
process.env.NODE_ENV = 'test';

const db = require('../database/index.js');
const utils = require('../server/lib/hashUtils.js');
jest.mock('../database/index.js');
jest.mock('../server/lib/hashUtils.js');


const { createUser } = require('../server/model');


describe('createUser function', () => {

  afterAll(async () => {
    // Clean up test database
    await db.end();
  });

  afterEach(() => {
    // Reset mocks after each test
    jest.clearAllMocks();
  });


  it('should insert user into the database', async () => {
  // Mock dependencies
  const mockClient = { release: jest.fn(), end: jest.fn() };
  const mockQueryResult = { rows: [{ id: 1, firstname: 'John', lastname: 'Doe' }] };
  db.connect.mockResolvedValue(mockClient);
  db.query.mockResolvedValue(mockQueryResult);
  utils.createRandom32String.mockReturnValue('abc');
  utils.createHash.mockReturnValue('hashedPassword');

  // Call the function
  const user = await createUser({
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    password: 'password',
    address1: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    country: 'USA',
    zipcode: '12345',
    photo: 'http://example.com/photo.jpg'
  });

  // Verify the results
  expect(user).toEqual({ id: 1, firstname: 'John', lastname: 'Doe' });
  expect(db.connect).toBeCalled();
  expect(db.query).toBeCalledWith({
    text: 'INSERT INTO users(firstname, lastname, username, password, salt, avatar_url, address1, address2, city, state, country, zipcode) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
    values: ['John', 'Doe', 'johndoe', 'hashedPassword', 'abc', 'http://example.com/photo.jpg', '123 Main St', undefined, 'Anytown', 'CA', 'USA', '12345']
  });
  expect(mockClient.release).toBeCalled();
  expect(utils.createRandom32String).toBeCalled();
  expect(utils.createHash).toBeCalledWith('password', 'abc');

  });
  it('should handle errors when create users', async () => {
    // Mock dependencies
    const mockClient = { release: jest.fn() };
    db.connect.mockResolvedValue(mockClient);
    db.query.mockRejectedValue(new Error('Database error'));

    // Call the function
    try {
      const user = await createUser({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        password: 'password',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        zipcode: '12345',
        photo: 'https://example.com/photo.jpg'
      });
    } catch (err) {
      // Test for the expected error
      expect(err.message).toEqual('Database error');
    }

    // Verify mock functions were called
    expect(db.connect).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toHaveBeenCalledTimes(1);
  });

});