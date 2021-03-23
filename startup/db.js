const mongoose = require("mongoose");

const Fawn = require("fawn");

require("dotenv").config();

const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

console.log(user, password);

module.exports = function initDB() {
  const db = `mongodb+srv://${user}:${password}@cluster0.g1ooo.mongodb.net/${database}?retryWrites=true&w=majority`;
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
