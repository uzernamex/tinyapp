// H E L P E R   F U N C T I O N S

const getUserByEmail = (email, database) => {
  for (const userID in database) {
    const user = database[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

module.exports = { getUserByEmail };

/*************************************************************/


const userLoggedIn = (req, users) => {
  console.log(!!req.session.user_id);
  return !!req.session.user_id && users[req.session.user_id];
};

module.exports.userLoggedIn = userLoggedIn;

/*************************************************************/


const generateRandomString = function() {
  const alphaNumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * alphaNumeric.length);
    randomString += alphaNumeric.charAt(index);
  }
  return randomString;
};

module.exports.generateRandomString = generateRandomString;

/*************************************************************/

//get url collection / list for a specific user
const urlsForUserId = function(userLoggedIn, urlDatabase, user_id) {
  if (userLoggedIn) {
    const urlForUser = {};
    for (const shortURL in urlDatabase) {
      if (urlDatabase[shortURL].userID === user_id) {
        urlForUser[shortURL] = urlDatabase[shortURL].longURL;
      }
    }
    return urlForUser;
  } else {
    return null;
  }
};

module.exports.urlsForUserId = urlsForUserId;
