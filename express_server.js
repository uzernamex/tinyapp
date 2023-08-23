const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;
const { password } = require("pg/lib/defaults");
const { post } = require("request");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const getUserByEmail = (email) => {
  for (const userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
    else if (!users[userID].email === email) {
      return res.status(403).send("Please verify that your email and password are correct.");
    }
  }
};

const userLoggedIn = (req) => {
  return req.session.user_id !== undefined; 
};

const urlDatabase = {
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
};

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

const generateRandomString = function() {
  const alphaNumeric = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * alphaNumeric.length);
    randomString += alphaNumeric.charAt(index);
  }
  return randomString;
};



app.get("/", (req, res) => {
  res.send("Hello!")
})

app.post("/login", (req, res) => {
  const user_id = req.body.user_id;
  const password = bcrypt.compareSync.password;
  req.session.user_id = user_id;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  if (userLoggedIn) {
    res.redirect("/urls");
  } else {
    return res.status(400).send("Please log in");
  }
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
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
  if(!req.session.user_id) {
    res.redirect ("/login");
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
    password: hashedpassword
  };
  req.session.user_id = userID;
  res.redirect("/urls");//redirect to urls page
});

app.post("/logout", (req, res) => {
  res.session.user_id = null;
  res.redirect("/login");
  res.render("/register");
});
  
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const userID = req.session.user_id;
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

const urlsForUserId = function() {
  if (userLoggedIn) {
    return longURL;
  }
};

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
  if (userLoggedIn) {
    res.redirect("/urls");
    } else {
      return res.status(400).send("Please log in");
    }
  });

//const shortURL = req.params.shortURl;
