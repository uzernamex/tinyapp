const express = require("express");
const app = express();
const PORT = 8080;


// H E L P E R   F U N C T I O N S

const {
const getUserByEmail = require("./helpers").getUserByEmail;
const userLoggedIn = require("./helpers").userLoggedIn;
const generateRandomString = require("./helpers").generateRandomString;
const urlsForUserId = require("./helpers").urlsForUserId;


// M I D D L E W A R E

const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["abc"],
}));
app.use(methodOverride('_method'));


// V A R I A B L E S (Global)

const users = require("./database").users;
const urlDatabase = require("./database").urlDatabase;

// R O U T I N G   [ R O O T ] - directs user based on login status

// H O M E P A G E


app.get("/", (req, res) => {
  if (!userLoggedIn(req, users)) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});


// L O G I N   R O U T E S

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
  
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userIdentity = user.id;
    res.redirect("/urls");
  } else {
    return res.status(401).send('Invalid email or password. Please <a href= "/register">register here<a> or "<a href= "/login">login<a> again.');
  }
});


// U R L   R O U T E S - displays URLs for a verified user

app.get("/urls", (req, res) => {
  if (userLoggedIn(req, users)) {
    const userUrls = urlsForUserId(urlDatabase, req.session.userIdentity);
    const templateVars = {
      urls: userUrls,
      user: users[req.session.userIdentity]
    };
    res.render("urls_index", templateVars);
  } else {
    res.status(401).send('<a href= "/login">login<a>');
  }
});

// - Generates a shortened URL

app.post("/urls", (req, res) => {
  if (userLoggedIn(req, users)) {
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    const userID = req.session.userIdentity;
    
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: userID
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send('Please <a href= "/login">login<a> to perform this action.');
  }
});

// - Deletes a specified url for the logged in user

app.post("/urls_show/:id", (req, res) => {
  if (req.session.userIdentity) {
    const user = users[req.session.userIdentity];
    const id = req.params.id;
    const longURL = user.urls[id].longURL;
    const templateVars = {
      user: user,
      id: id,
      longURL: longURL
    };
    res.render("templateName", templateVars);
  } else {
    // Handle the case where the user is not logged in
    res.redirect("/login");
  }
});


app.put("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});


app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  const userID = req.session.userIdentity;
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(404).send("URL has been deleted");
  }
});

app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  const userID = req.session.userIdentity;
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userID) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// - Retrieves url data pertaining to authenticated user's information

app.get("/urls/new", (req, res) => {
  if (req.session.userIdentity) {
    const templateVars = {
      urls: urlDatabase.longURL,
      user: users[req.session.id]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// - displays URL for the logged in user

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userIdentity;
  const templateVars = {
    urlDatabase,
    shortURL,
    id: shortURL,
    longURL: urlDatabase[shortURL],
    user: users[userID]
  };
  if (!urlDatabase[shortURL]) {
    res.status(404).send("Url does not exist");
  } else {
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  if (shortURL) {
    res.redirect(longURL);
  } else {
    res.status(401).send('Please <a href= "/login">log in<a>');
  }
});

// L O G O U T - Action to log user out, sends user to login page

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
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
  
  if (getUserByEmail(email, users)) {
    res.status(400).send('This email already exists in the database; Please <a href= "/login">login<a>.');
  } else {
    users[userID] = {
      id: userID,
      email: email,
      password: hashedPassword
    };
    req.session.userIdentity = userID;
    res.redirect("/urls");
  }
});

// E X P R E S S   S E R V E R

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});