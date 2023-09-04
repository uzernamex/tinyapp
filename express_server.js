const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const urlDatabase = require("./database").urlDatabase;
const users = require("./database").users;
const getUserByEmail = require("./helpers").getUserByEmail;
const userLoggedIn = require("./helpers").userLoggedIn;
const generateRandomString = require("./helpers").generateRandomString;
const urlsForUserId = require("./helpers").urlsForUserId;
const cookieSession = require('cookie-session');

const app = express();
const PORT = 8080;
const { password } = require("pg/lib/defaults");
const { post } = require("request");
const { request } = require("express");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [/* secret keys */"abc"],
}));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  if(!userLoggedIn(req, users)) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  // const user_id = req.body.user_id;
const password = req.body.password;
const email = req.body.email;
const user = getUserByEmail(email, users);
const hashedPassword = user.password;

  // const password = users.
if (bcrypt.compareSync(password, hashedPassword)) {
  req.session.user_id = user.id;
  res.redirect("/urls");
} else {
  return res.status(401).send("Invalid email or password");
}
});

app.get("/login", (req, res) => {
if (userLoggedIn(req, users)) {
  console.log(">>>>>>>>>>>>>>>>", req.session.user_id)
    res.redirect("/urls");
  } else {
    return res.render("login");
  }
});

app.get("/urls", (req, res) => {
console.log("*****************", users[req.session.user_id])
  if (userLoggedIn(req, users)) {
    const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  res.render("urls_index", templateVars);
  } else {
    res.send("<p> Please login </p>")
  }
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (!longURL || !req.session.user_id) {
    console.error("Error: Unable to locate requested URL");
  } else {
    const templateVars = { id, longURL };
    res.render("urls_show", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    res.render("urls_new");
  }
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

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
  res.render("/register");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const userID = req.session.user_id;
  urlDatabase[shortURL] = longURL;

  if (urlDatabase[shortURL]) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    console.error("Shortened URL unavailable");
  }
  res.redirect(`/urls/${shortURL}`);
  console.log(req.body);
  const randomString = generateRandomString();
  console.log(randomString);
  res.send("Ok");
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    console.error("URL unavailable");
  }
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {

  if (userLoggedIn(req, users)) {
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});