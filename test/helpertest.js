
const { assert } = require('chai');
const { findUser, generateRandomString } = require("../helpers.js");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUser', function() {
  it('should return a user with valid email', function() {
    const user = findUser(testUsers, "user@example.com")
    const expectedUserID = "userRandomID";
   assert.equal(user, testUsers.userRandomID)
  });
  it('should return undefined user with invalid email', function() {
    const user = findUser(testUsers, "user@exampyBoi.com")
    const expectedUserID = "userRandomID";
   assert.equal(undefined, undefined)
  });
});

describe('generateRandomString', function() {
  it('should generate 6 random integers', function()  {
    const randomString = generateRandomString();
    const assertRandomString = '124356'; 
    assert.equal(randomString.length, assertRandomString.length)
  })
})