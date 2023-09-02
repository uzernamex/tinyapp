const getUserByEmail = (email, database) => {
  for (const userID in database) {
    const user = database[userID];
    if (user.email === email) {
      return user;
    }
    if((!email) || (!password)) {
    return res.status(400)({error: "Please enter the correct email and password"});
  }
  if (getUserByEmail === email) {
    return res.status(400)({
      error: "User already exists."
    })
  }
}
return null;
};

module.exports = {getUserByEmail};

// const getUserByEmail = (email) => {
//   for (const userID in users) {
//     if (users[userID].email === email) {
//       return users[userID];
//     }
//     else if (!users[userID].email === email) {
//       return res.status(403).send("Please verify that your email and password are correct.");
//     }
//   }
// };

const userLoggedIn = (req) => {
  return req.session.user_id !== undefined; 
};

module.exports.userLoggedIn;


const generateRandomString = function() {
  const alphaNumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * alphaNumeric.length);
    randomString += alphaNumeric.charAt(index);
  }
  return randomString;
};

module.exports.generateRandomString;


const urlsForUserId = function() {
  if (userLoggedIn) {
    return longURL;
  }
};
module.exports.urlsForUserId; 

