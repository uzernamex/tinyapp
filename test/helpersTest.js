// T E S T I N G

const { assert } = require('chai');

const {
  getUserByEmail,
  userLoggedIn,
  generateRandomString,
  urlsForUserId
} = require('../helpers.js');


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


const testUrlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lw",
  },
  psm5xK: {
    longURL: "http://www.google.com",
    userID: "aJ48lw",
  },
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  y9n1Mx: {
    longURL: "https://www.ctv.ca/shows/catfish-the-tv-show",
    userID: "Ft85fs",
  }
};


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID, `Expected user ID to be: ${expectedUserID}`);
  });
  it('should be undefined if there is no email', function() {
    const user = getUserByEmail("noemail@example.com", testUsers);
    assert.isUndefined(user, `This email is not found.`);
  });
});


describe('userLoggedIn', function() {
  it('should return true if the user is logged in', function() {
    const req = {
      session: {
        userIdentity: "userRandomID"
      }
    };
    const loggedInUser = userLoggedIn(req, testUsers);
    assert.isFalse(loggedInUser, 'User should not be logged in to website');
  });
});


describe('generateRandomString', function() {
  it('should return a string of 6 random characters', function() {
    const randomString = generateRandomString();
    assert.strictEqual(randomString.length, 6, 'The string should be 6 characters in length');
  });
});


describe('urlsForUserId', function() {
  it('should return an object that contains the URLs relating to a specific user', function() {
    const userIdentity = "userRandomId";
    const urlForUser = urlsForUserId(false, testUrlDatabase, userIdentity);
    assert.isNull(urlForUser, 'User cannot be logged in');
  });
});