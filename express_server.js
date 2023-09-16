// M O D U L E   I M P O R T S

const express = require("express");
const cookieSession = require('cookie-session');
const getUserByEmail = require("./helpers").getUserByEmail;
const userLoggedIn = require("./helpers").userLoggedIn;
const generateRandomString = require("./helpers").generateRandomString;
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const users = require("./database").users;
const urlDatabase = require("./database").urlDatabase;

const app = express();
const PORT = 8080;


// V I E W   E N G I N E

app.set("view engine", "ejs");


// M I D D L E W A R E

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["abc"],
}));


// R O U T I N G   [ R O O T ] - directs user based on login status

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
    return res.status(401).send("Invalid email or password");
  }
});


// U R L   R O U T E S - displays URLs for a verified user

app.get("/urls", (req, res) => {
  if (userLoggedIn(req, users)) {
    const templateVars = {
      urls: urlDatabase,
      user: users[req.session.userIdentity]
    };
    res.render("urls_index", templateVars);
  } else {
    res.status(401).send("<p> Please login </p>");
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
    res.status(401).send("Please log in to perform this action");
  }
});

// - Deletes a specified url for the logged in user

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userIdentity;
  
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(404).send("URL not found");
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

app.post("urls/new", (req, res) => {
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

app.get("/urls#", (req, res) => {
  if (req.session.userIdentity) {
    res.redirect("urls_new");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls#", (req, res) => {
  if (req.session.userIdentity) {
    res.redirect("/urls/new");
  }
});


// - displays URL for the logged in user

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  let user = null;
  
  if (!longURL || !req.session.userIdentity) {
    const templateVars = { id, longURL, user };
    res.render("urls_show", templateVars);
  } else if (longURL && req.session.userIdentity) {
    res.redirect("/urls");
  }
});


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

app.post("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (shortURL) {
    res.redirect(longURL);
  } else {
    res.status(401).send("Please log in");
  }
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  if (shortURL) {
    res.redirect("longURL");
  } else {
    res.status(404).send("URL not found");
  }
});

   
// L O G O U T - Action to log user out, sends user to login page

app.post("/logout", (req, res) => {
  req.session.userIdentity = null;
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
  
  if (getUserByEmail(email, users)) {
    res.status(400).send("This email already exists in the database; Please login.");
    res.redirect("/login");
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