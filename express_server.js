const express = require("express");
const bodyParser = require("body-parser");
const { password } = require("pg/lib/defaults");
const app = express();
const PORT = 8080;
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  if (!longURL) {
    console.error("Error: Unable to locate requested URL");
  } else {
    const templateVars = {id, longURL};
    res.render("urls_show", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
  const user = getUserByEmail(email);
  if (!user || user.password!== password) {
    return res.status(403).send("Invalid email or password");
  }
});

app.post("/register", (req, res) => {
  const email = req.body.email; 
  const password = req.body.password;
  const userID = generateRandomString();
  
  //add user to database (users object)
users[userID] = {
  id: userID,
  email: email,
  password: password
}

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
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/login");
  res.render("/register")
})

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
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