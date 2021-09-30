//REQUIRES AND SETS////////////////////////////////////
const { request } = require("express");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");


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

const users = { 
  "user1": {
    id: "user1", 
    email: "1@1.com", 
    password: "1234"
  },
 "user2": {
    id: "user2", 
    email: "2@2.com", 
    password: "abcd"
  }
};

//FUNCTIONS
const generateRandomString = function () {
  const charactersForString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let randomIDArray = [];
  for (let i = 1; i<=6; i++) {
    randomIDArray.push(charactersForString[Math.floor(Math.random() * (charactersForString.length - 1))]);
  }
  return randomIDArray.join("");
}

const findUserByEmail = function(emailAddress) {
  let user
  for (let userID in users) {
    user = users[userID]
    if (user.email === emailAddress) {
      return user;
    }
  }
  return null;
};

//GET ROUTES
app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls", (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const myURL = {};
  if(user) {
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
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = {
    selectedUser: user
  }
  if (!userID) {
    return res.redirect("/urls/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/register", (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = {
    selectedUser: user
  }
  if (userID) {
    return res.redirect("/urls");
  }
  res.render("urls_register", templateVars);
});

app.get("/urls/login", (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = {
    selectedUser: user
  }
  if (userID) {
    return res.redirect("/urls");
  }
  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    selectedUser: user 
  }
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.redirect("/urls/login")
  }
  const longURL = urlDatabase[shortURL].longURL;
  
  //const longURL = urlDatabase[req.params["shortURL"].longURL];
  res.redirect(longURL);
});

//POST ROUTES
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const userID = req.cookies['user_id'];

  //Block this post pathway if there are not logged in users - prevents posting from the command line
  if (!userID) {
    return res.redirect("/urls/login");
  }

  urlDatabase[shortURL] = {
    longURL:req.body["longURL"],
    userID: userID
  } 
  res.redirect(`/urls/${shortURL}`);
  
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params["shortURL"]] = req.body["longURL"];
  //console.log(urlDatabase);
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  const password = req.body.password
  const email = req.body.email

  if(!password || !email) {
    return res.status(400).send("Email or password are missing");
  }

  const user = findUserByEmail(email)

  //if user can't be found
  if(!findUserByEmail(email)) {
    return res.status(403).send("There are no users matching that email address");
  }
  //if email exists, check password to see if it is right
  if(user.password !== password) {
    return res.status(403).send("The password is incorrect");
  }
  console.log(req.body)
  res.cookie ('user_id', user.id);
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
});

app.post("/register", (req, res) => {
  const password = req.body.password
  const email = req.body.email
  userID = generateRandomString();
  
  //check if email or password are empty
  if(!password || !email) {
    return res.status(400).send("Email or password are missing");
  }

  //check if the email already exists
  
  if (findUserByEmail(email)) {
    return res.status(400).send("Email already exists");
  }

  users[userID] = {
    id: userID,
    email: email,
    password: password
  };

  res.cookie("user_id", userID);
  console.log(users)
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});