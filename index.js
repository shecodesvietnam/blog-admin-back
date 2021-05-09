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

const port = process.env.PORT || 3000;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Listening to port ${port}`);
  console.log(`Server Ready at http://${host}:${port}`);
});
