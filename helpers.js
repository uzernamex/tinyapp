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