const { findUserByEmail } = require("../helpers");
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