const { createHash, compareHash} = require('../server/lib/hashUtils');

describe('createHash function', () => {
  it ('should create a hash with salt', () => {
    const password = '1234';
    const salt = '9bcb1c6ad92290fea031cdc37787c5b1010c5e90056eac4d98e7adc556068dcd';
    const expectedHash = 'd3e46b63c52e4073f1df20bd064c70cd20cba15d7d607888eabca58cb792d809';
    const hash = createHash(password, salt);
    expect(hash).toEqual(expectedHash);
  });
  it('should compare saved hash password and orignal password with salt', () => {
    const password = '1234';
    const salt = '9bcb1c6ad92290fea031cdc37787c5b1010c5e90056eac4d98e7adc556068dcd';
    const expectHash = 'd3e46b63c52e4073f1df20bd064c70cd20cba15d7d607888eabca58cb792d809';
    const result = compareHash(password, expectHash, salt);
    expect(result).toBe(true);
  })
});
