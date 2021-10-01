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

const urlsForUser = function(id, database) {
  const userURLs = [];
  for (let shortURL in database) {
    if (database[shortURL].userID === id ) {
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