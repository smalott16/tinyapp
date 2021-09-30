//FUNCTIONS
const generateRandomString = function() {
  const charactersForString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let randomIDArray = [];
  for (let i = 1; i <= 6; i++) {
    randomIDArray.push(charactersForString[Math.floor(Math.random() * (charactersForString.length - 1))]);
  }
  return randomIDArray.join("");
};

const findUserByEmail = function(emailAddress, database) {
  let user;
  for (let userID in database) {
    user = database[userID];
    if (user.email === emailAddress) {
      return user;
    }
  }
  return undefined;
};

const urlsForUser = function(id) {
///this may be a useful function to refactor code to
///a function that returns the urls associated with a particular user
///this a smarter way than how I did it.
  console.log(id)
  const userURLs = [];
  for (let shortURL in urlDatabase) {
    if (shortURL.userID === id ) {
      userURLs.push(shortURL);
    }
  }
  return userURLs;
};

module.exports = {
  generateRandomString,
  findUserByEmail,
  urlsForUser
};