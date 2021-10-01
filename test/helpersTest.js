const { findUserByEmail, urlsForUser } = require("../helpers");
const { assert } = require("chai")

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

describe("#findUserByEmail", () => {

  it("should return the correct object when passed an email address that exists within the users object", () => {
    const expectedObject = users["user1"]
    const actualObject = findUserByEmail("1@1.com", users);

    assert.deepEqual(actualObject, expectedObject);
  })

  it("should return undefined when passed an email address that doesn't exist", () => {
    actualObject = findUserByEmail("jseinfeld@nbc.com", users);

    assert.equal(actualObject, undefined);
  })

});

describe("#urlsForUser", () => {

  it("it should return an array of short urls associated with a given user id", () => {
    const urls = urlsForUser("user1", urlDatabase)
    assert.deepEqual(urls, ["b2xVn2"]);
  });

});