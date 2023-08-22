const express = require("express");
const bodyParser = require("body-parser");
const { password } = require("pg/lib/defaults");
const { post } = require("request");
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const urlsForUserId = function() {
  if (userLoggedIn) {
    return longURL
  }
  return userID = userLoggedIn(longURL);
};

//req.session.user_id = "some value";
//To set the user_id key on a session, write: req.session.user_id = "some value";
//To read a value, write: req.session.user_id

app.set("view engine", "ejs");
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (!longURL || !userLoggedIn) {
    console.error("Error: Unable to locate requested URL");
  } else {
    const templateVars = {id, longURL};
    res.render("urls_show", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
  if (!userLoggedIn) {
    res.redirect ("/login");
    return app.post("Registration is required to complete this action");
  }
});

app.get("/login", (req, res) => {
  const userLoggedIn = getUserByEmail(email);
  if (userLoggedIn) {
    res.redirect("/urls");
  } else {
    return res.status(400).send("Please log in");
  }
});

const alphaNumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
const generateRandomString = function() {
  let randomString = "";
  for (i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * alphaNumeric.length);
    randomString += alphaNumeric.charAt(index);
  }
  return randomString;
};

app.post("/login", (req, res) => {
  const uuser_id = req.body.user_id;
  const authorize = bcrypt.compareSync.password;
  
  res.cookie("user_id", user_id);
  res.redirect("/urls");

  const getUserByEmail = (email) => {
    for (const userID in users) {
      if (!users[userID].email === email) {
        return users[userID];
      }
    }
    return res.status(403).send("Invalid email or password");
  }
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email; 
  const password = req.body.password;
  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync(password, 10);
  bcrypt.compareSync
  
  //req.session.user_id = "some value";
//To set the user_id key on a session, write: req.session.user_id = "some value";
//To read a value, write: req.session.user_id

  //add user to database (users object)
users[userID] = {
  id: userID,
  email: email,
  password: password
}





const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};






if (!email || !password) {
  return res.status(400).send("Please verify that your email and password are correct.");
};

//set cookie with the userID
  res.cookie("user_id", userID);

  //redirect to urls page
  res.redirect("/urls")
});
  
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
  if (userLoggedIn) {
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/login");
  res.render("/register")
})

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const userID = req.cookies.user_id; 
  urlDatabase[shortURL] = longURL;
  if(urlDatabase[shortURL]) {
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
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    register: res.render("register"),
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
const getUserByEmail = (email) => {
  return users.find(user => user.email === email);
}
if((!email) || (!password)) {
  return res.status(400)({error: "Please enter the correct email and password"});
}
if (getUserByEmail === email) {
  return res.status(400)({
    error: "User already exists."
  })
};

const authorizedUser = function(req, res) {
  const userID = req.cookies.user_id;
  const shortURL = req.params.shortURl; 
  if (!userID) {
    return res.status(403).send("Please login to perform this action");
  } 
  if (!urlDatabase[shortURL] || urlDatabase[shortURL]) {
   return res.status(403).send("Permission required to vie this page") 
  }
};
