const express = require("express");
const methodOverride = require("method-override");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(methodOverride("_method"));

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/static")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT;
const host = process.env.HOST;
const server = app.listen(port, host, () => {
  console.log(`Listening to port ${port}`);
  console.log(`Server Ready at http://${host}:${port || 3000}/api`);
});
