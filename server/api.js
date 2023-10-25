const { body, validationResult } = require("express-validator");
const hashing = require("./hashing");
const sqlite3 = require("sqlite3");

let db;

const initializeAPI = async (app) => {
  db = new sqlite3.Database("./AB04.db", (err) =>
    err ? console.error(err.message) : console.log("Connected to the database.")
  );

  app.post(
    "/api/login",
    body("username")
      .notEmpty()
      .withMessage("Username is empty")
      .isEmail()
      .withMessage("Invalid E-Mail format"),
    body("password")
      .isLength({ min: 10 })
      .withMessage("Password should be longer than 10 characters.")
      .escape(),
    login
  );
};

const login = async (req, res) => {
  const resultOfValidation = validationResult(req);

  if (!resultOfValidation.isEmpty())
    return res.send(
      resultOfValidation
        .array()
        .map((err) => err.msg)
        .join(", ")
    );

  const { username, password } = req.body;

  const hash = await hashing.password(password);

  const answer = `
    <h1>Answer</h1>
    <p>Username: ${username}</p>
    <p>Password: ${hash}</p>`;
  res.send(answer);
};

module.exports = { initializeAPI };
