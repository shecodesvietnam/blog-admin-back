const mongoose = require("mongoose");
const Fawn = require("fawn");
const { db } = require("./../config");
require("dotenv").config();

module.exports = function initDB() {
  mongoose
    .connect(
      "mongodb+srv://dhoang:123@cluster0.g1ooo.mongodb.net/test?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    )
    .then(function log() {
      console.log(`Connected to ${db}...`);
      Fawn.init(mongoose);
    })
    .catch((err) => {
      console.log(err);
    });
};
