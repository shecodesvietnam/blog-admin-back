const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("./../models/users");
const router = express.Router();

function validate(request) {
  return Joi.validate(request, {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
}

router.post("/", async function handle(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email");

  if (!user.isAdmin) return res.status(400).send("Invalid admin");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
