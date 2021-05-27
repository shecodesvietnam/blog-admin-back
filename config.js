const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const db = `mongodb+srv://${user}:${password}@cluster0.pjyub.mongodb.net/${database}?retryWrites=true&w=majority`;

module.exports.db = db;
