const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const result = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books unavailable"));
      }
    });

    return res.status(200).json({
      books: result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const result = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books unavailable"));
      }
    });

    const booksByIsbn = result[isbn];

    return res.status(200).json({
      books: booksByIsbn
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;

  try {
    const result = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books unavailable"));
      }
    });

    const booksByAuthor = Object.values(result).filter((b) => { return b.author === author });

    return res.status(200).json({
      books: booksByAuthor
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;

  try {
    const result = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books unavailable"));
      }
    });

    const booksByTitle = Object.values(result).filter((b) => { return b.title === title });

    return res.status(200).json({
      books: booksByTitle
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  return res.send(JSON.stringify(reviews,null,4));
});

module.exports.general = public_users;
