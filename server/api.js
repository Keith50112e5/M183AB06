const { body, validationResult } = require("express-validator");
const hashing = require("./hashing");
const { Database } = require("sqlite3");
const jwt = require("jsonwebtoken");
const { posts } = require("./mock");
const { auth } = require("./auth");

let db;

const initializeAPI = async (app) => {
  db = new Database("./AB04.db", (err) =>
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
  app.get("/api/posts", auth, (req, res) => res.json(posts));
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

  const secret = process.env.SECRET || "very_secret_;-)";

  const token = jwt.sign({ username, password }, secret, { expiresIn: "1h" });

  const answer = `
    <h1>Answer</h1>
    <p>Username: ${username}</p>
    <p>Password: ${hash}</p>`;

  res.json({ token, answer });
};

module.exports = { initializeAPI };
