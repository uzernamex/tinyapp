/* eslint-disable camelcase */
// I M P O R T S  [F I L E S,  R O U T E S,  L I B R A R I E S,  &  M I D D L E W A R E]

const express = require("express");
const cookieSession = require('cookie-session');
const getUserByEmail = require("./helpers").getUserByEmail;
const userLoggedIn = require("./helpers").userLoggedIn;
const generateRandomString = require("./helpers").generateRandomString;
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const users = require("./database").users;
const urlDatabase = require("./database").urlDatabase;

//**********************************************************/

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["abc"],
}));

//Redirects user to based on login status

app.get("/", (req, res) => {
  if (!userLoggedIn(req, users)) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

//step one
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//step two
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// U R L S   R O U T E S

//displays URLs once user is logged in
app.get("/urls", (req, res) => {
  if (userLoggedIn(req, users)) {
    const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
    res.render("urls_index", templateVars);
  } else {
    res.send("<p> Please login </p>");
  }
});

//Generates a short URL

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; //req.urlDatabase.longURL.longURL;
  const shortURL = generateRandomString();
 
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);

});

// if (urlDatabase[shortURL]) {
//   delete urlDatabase[shortURL];
//   // res.redirect("/urls");
// } else {
// //   console.error("Shortened URL unavailable");
// // }
// return 
// //const randomString = generateRandomString();
// //res.send("Ok");
// }
//Form to create new URL

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
    res.render("urls_new", templateVars);
  }
});

//displays URL for the ogged in user

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  let user = null;
  if (!longURL || !req.session.user_id) {
    console.error("Error: Unable to locate requested URL");
  } else {
    const templateVars = { id, longURL, user };
    console.log(templateVars);
    res.render("urls_show", templateVars);
  }
});

//redirects to original long URL from short URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    console.error("URL unavailable");
    res.status(404).send("URL not found");
  }
});


// L O G I N  R O U T E S

app.get("/login", (req, res) => {
  if (userLoggedIn(req, users)) {
    res.redirect("/urls");
  } else {
    return res.render("login");
  }
});

app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = getUserByEmail(email, users);
  const hashedPassword = user.password;

  if (bcrypt.compareSync(password, hashedPassword)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    return res.status(401).send("Invalid email or password");
  }
});


// L O G O U T

//action to log user out, sends user to login page
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
  res.render("register");
});


//  R E G I S T E R   R O U T E S

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[userID] = {
    id: userID,
    email: email,
    password: hashedPassword
  };

  req.session.user_id = userID;
  res.redirect("/urls");//redirect to urls page
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});