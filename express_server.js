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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
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

//GET ROUTES
app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls", (req, res) => {
  const username = req.cookies['username'];
  const templateVars = {
    urls: urlDatabase,
    username : username ? username : ""
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies['username'];
  const templateVars = {
    username : username ? username : ""
  }
  res.render("urls_new", templateVars);
})

app.get("/urls/register", (req, res) => {
  const username = req.cookies['username']
  const templateVars = {
    username: username ? username : ''
  }

  res.render("urls_register", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies['username'];

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: username ? username : '' 
  }
  //console.log(templateVars);
  res.render("urls_show", templateVars);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params["shortURL"]];
  res.redirect(longURL);
})

//POST ROUTES
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"]

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
  res.cookie ('username', req.body["username"]);
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls")
});

app.post("/register", (req, res) => {
  const password = req.body.password
  const email = req.body.email
  userID = generateRandomString();

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