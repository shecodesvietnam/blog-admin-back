const express = require("express");
const error = require("./../middleware/error");
const auth = require("./../routes/auth");
const users = require("./../routes/users");
const posts = require("./../routes/posts");
const media = require("./../routes/media");
const comments = require("./../routes/comments");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/posts", posts);
  app.use("/api/media", media);
  app.use("/api/comments", comments);
  app.use(error);
};
