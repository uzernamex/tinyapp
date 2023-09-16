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
//V I E W   E N G I N E

app.set("view engine", "ejs");

//M I D D L E W A R E

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["abc"],
}));

// R O U T I N G  [ R O O T ], directs user to URLS of LOGIN based on login status

app.get("/", (req, res) => {
  if (!userLoggedIn(req, users)) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

// //step one
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// //step two
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// U R L S   R O U T E S - displays URLs once user is logged in

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

//Generates a short URL

app.post("/urls", (req, res) => {
  if (userLoggedIn(req, users)) {
    const longURL = req.body.longURL; //req.urlDatabase.longURL.longURL;
    const shortURL = generateRandomString();
    const userID = req.session.userIdentity;
    
    urlDatabase[shortURL] = {
      longURL: longURL, //req.body.longURL, //LONGURL OR //CHK
      userID: userID //req.session.userID
    };
    
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send("Please log in first");
  }
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

app.get("/urls/new", (req, res) => {
  //const id = req.params.id;
  //const longURL = urlDatabase[id];
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
  const longURL = req.body.longURL;
  const userID = req.session.userIdentity;
  if (userLoggedIn(req, users)) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: userID
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send("Please log in");
  }
});
//*******>>displays URL for the logged in user

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  let user = null;
  //**if logged in */
  if (!longURL || !req.session.userIdentity) {
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


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userIdentity;
  //const urlsForUserId = users(userID, urlDatabase);
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
  //const hashedPassword = user.password;
  
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userIdentity = user.id;
    res.redirect("/urls");
  } else {
    return res.status(401).send("Invalid email or password");
  }
});
 
    
    
//     (bcrypt.compareSync(password, hashedPassword)) {
//     req.session.userIdentity = user.id;
//     res.redirect("/urls");
//   } else {
//     return res.status(401).send("Invalid email or password");
//   }
// });


// L O G O U T

//action to log user out, sends user to login page
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
    res.status(400).send("This email already exists in the database");
  } else {
    users[userID] = {
      id: userID,
      email: email,
      password: hashedPassword
    };
    req.session.userIdentity = userID;
    res.redirect("/urls");//redirect to urls page
  }
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});