//Initialize
const { request } = require("express");
const { generateRandomString, findUserByEmail, urlsForUser} = require("./helpers");
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

//Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


//GLOBAL VARIABLES
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "user1"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2"
  }
};

// For Evaluator: 2 dummy users added for testing. User1 password is 1234, User2 password is abcd
const users = {
  "user1": {
    id: "user1",
    email: "1@1.com",
    password: "$2a$10$0jn8zsIOs9Nz9lIywpY6bOmqvN7RhNACAKWMXAK4eVEsNNsZfJgAa"
  },
  "user2": {
    id: "user2",
    email: "2@2.com",
    password: "$2a$10$1La/.trT9wIGzxNbbfXaL.QTsPe8DRiChHoDkfumj7RhnUXlFpK6y"
  }
};

//GET ROUTES
app.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    return res.redirect("/urls");
  }
  res.redirect("/login");
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const myURL = {};
  
  //logic if the user is logged in, (i.e. there is a user cookie), make an object for the
  //currently logged in user that contains all of their associated urls
  if (user) {
    for (let key in urlDatabase) {
      if (urlDatabase[key].userID === user.id) {
        myURL[key] = urlDatabase[key];
      }
    }
  }

  const templateVars = {
    urls: myURL,
    selectedUser: user,
    id: userID
  };
  
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {
    selectedUser: user
  };
  console.log(userID)
  if (!userID) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {
    selectedUser: user
  };

  //if user is already logged in redriect to urls page
  if (userID) {
    return res.redirect("/urls");
  }
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {
    selectedUser: user
  };
  if (userID) {
    return res.redirect("/urls");
  }
  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const usersURLs = urlsForUser(userID, urlDatabase);
  
  //check if the short url doesnt exists for the user but the user is logged in got to error page
  if (usersURLs.indexOf(shortURL) === -1 && userID) {
    return res.status(404).render("urls_error");
  }

  //if youre not logged in and you enter a valid short url
  if (!userID) {
    return res.status(401).render("urls_error");
  }
  const user = users[userID];
  const templateVars = {
    shortURL: shortURL, 
    longURL: urlDatabase[shortURL].longURL,
    selectedUser: user
  };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.status(404).render("urls_error");
  }
  const longURL = urlDatabase[shortURL].longURL;
  
  res.redirect(longURL);
});

//POST ROUTES
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const userID = req.session.user_id;

  //if users are not logged in they are redirected to the login page
  if (!userID) {
    return res.redirect("/login");
  }

  urlDatabase[shortURL] = {
    longURL:req.body["longURL"],
    userID: userID
  };
  res.redirect(`/urls/${shortURL}`);
  
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  
  //if user is logged in but they don't own the url go to error page
  const usersURLs = urlsForUser(userID, urlDatabase);
  if (usersURLs.indexOf(shortURL) === -1 && userID) {
    return res.status(401).render("urls_error");
  }
  //if the user id does not exist throw an error
  if (!userID) {
    return res.status(401).render("urls_error");
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  
  //if not logged in while trying to post, chuck an error
  if (!userID) {
    return res.status(401).render("urls_error");
  }

  urlDatabase[req.params["shortURL"]].longURL = req.body["longURL"];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  if (!password || !email) {
    return res.status(400).render("urls_login_error");
  }

  const user = findUserByEmail(email, users);

  //if user can't be found chuck an error
  if (!user) {
    return res.status(403).render("urls_login_error");
  }
  //if email exists, check password to see if it is right. If it isnt, chuck an error. 
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).render("urls_login_error");
  }
  
  //set user id cookie and redirect
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  //clear cookies and redirect
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const hashedPassword = bcrypt.hashSync(password, 10);

  userID = generateRandomString();

  //check if email or password are empty
  if (!password || !email) {
    return res.status(400).render("urls_reg_error");
  }

  //check if the email already exists
  if (findUserByEmail(email, users)) {
    return res.status(400).render("urls_email_error");
  }

  users[userID] = {
    id: userID,
    email: email,
    password: hashedPassword
  };

  //set user id cookie and redirect
  req.session.user_id = userID;
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});