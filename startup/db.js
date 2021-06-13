const mongoose = require("mongoose");
const Fawn = require("fawn");
const { db } = require("./../config");
require("dotenv").config();

module.exports = function initDB() {
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(function log() {
      console.log(`Connected to ${db}...`);
      Fawn.init(mongoose);
    })
    .catch((err) => {
      console.log(err);
    });
};
