const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const connectLink = process.env.DB_CONNECTSTRING;

const db = connectLink
  .replace("<user>", user)
  .replace("<password>", password)
  .replace("<database>", database);

module.exports.db = db;
