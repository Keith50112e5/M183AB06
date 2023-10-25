require("dotenv").config();
const express = require("express");
const http = require("http");
const { initializeAPI } = require("./api");

// Create the express server
const app = express();
app.use(express.json());
const server = http.createServer(app);

const { rateLimit } = require("express-rate-limit");

const limit = rateLimit({
  windowMs: 6e4,
  limit: 50,
});

app.use(limit);

// deliver static files from the client folder like css, js, images
app.use(express.static("client"));
// route for the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

// Initialize the REST api
initializeAPI(app);

//start the web server
const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
  console.log(`Express Server started on http://localhost:${serverPort}/`);
});
