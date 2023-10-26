const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { initializeDatabase, queryDB, insertDB } = require("./database");
const jwt = require("jsonwebtoken");
const AES = require("aes-encryption");
const RSA = require("node-rsa");

const KeyLength = { b: 1024 };

const key = new RSA(KeyLength);

const aes = new AES();

const aesSecret = process.env.AES_SECRET;

aes.setSecretKey(aesSecret);

let db;

const jwtSecret = process.env.JWT_SECRET || "supersecret";

const initializeAPI = async (app) => {
  db = initializeDatabase();
  app.post(
    "/api/login",
    body("username")
      .notEmpty()
      .withMessage("Username is required.")
      .isEmail()
      .withMessage("Invalid email format."),
    body("password")
      .isLength({ min: 10, max: 64 })
      .withMessage("Password must be between 10 to 64 characters.")
      .escape(),
    login
  );
  app.get("/api/posts", getPosts);
  app.post("/api/post/create", addPost);
  app.get("/api/keys", getKeys);
};

const getKeys = (req, res) => {
  req.log.info("Benutzer verlangt RSA Schlüssel.");
  key.generateKeyPair();
  const public = key.exportKey("pkcs8-public-pem");
  const private = key.exportKey("pkcs8-private-pem");
  res.json({ public, private });
};

const addPost = async (req, res) => {
  req.log.info("Benutzer fügt einen Post hinzu.");
  const { title, content } = req.body;

  const insertPostQuery = `
  INSERT INTO posts ('title', 'content') VALUES
  ('${aes.encrypt(title)}', '${aes.encrypt(content)}');  `;
  await insertDB(db, insertPostQuery);
  res.send("OK");
};

const login = async (req, res) => {
  req.log.info("Benutzer loggt sich ein.");
  // Validate request
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const formattedErrors = [];
    result.array().forEach((error) => {
      console.log(error);
      formattedErrors.push({ [error.path]: error.msg });
    });
    return res.status(400).json(formattedErrors);
  }

  // Check if user exists
  const { username, password } = req.body;
  const getUserQuery = `
    SELECT * FROM users WHERE username = '${username}';
  `;
  const user = await queryDB(db, getUserQuery);
  if (user.length === 0) {
    return res
      .status(401)
      .json({ username: "Username does not exist. Or Passwort is incorrect." });
  }
  // Check if password is correct
  const hash = user[0].password;
  const match = await bcrypt.compare(password, hash);
  if (!match) {
    return res
      .status(401)
      .json({ username: "Username does not exist. Or Passwort is incorrect." });
  }
  // Create JWT
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: { username, roles: [user[0].role] },
    },
    jwtSecret
  );

  return res.send(token);
};

const getPosts = async (req, res) => {
  req.log.info("Benutzer liest Posts aus.");
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: "No authorization header." });
  }
  const [prefix, token] = authorization.split(" ");
  if (prefix !== "Bearer") {
    return res.status(401).json({ error: "Invalid authorization prefix." });
  }
  const tokenValidation = jwt.verify(token, jwtSecret);
  if (!tokenValidation?.data) {
    return res.status(401).json({ error: "Invalid token." });
  }
  if (!tokenValidation.data.roles?.includes("viewer")) {
    return res.status(403).json({ error: "You are not a viewer." });
  }

  const getPostsQuery = `SELECT * FROM posts;`;

  const postsEncrypted = await queryDB(db, getPostsQuery);

  const posts = postsEncrypted.map((post) => {
    let { title, content } = post;
    try {
      title = aes.decrypt(title);
      content = aes.decrypt(content);
    } catch (err) {}
    return { title, content };
  });
  return res.send(posts);
};

module.exports = { initializeAPI };
