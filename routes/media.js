const express = require("express");
const auth = require("./../middleware/auth");
const admin = require("./../middleware/admin");
const router = express.Router();

router.post("/", [auth, admin], async function handle(req, res) {
  if (!req.files) return res.status(400).send("File is required");

  try {
    req.files.file.forEach(function save(media) {
      media.mv("media/" + media.name, function (err) {
        if (err) throw err;
      });
    });
    res.send("File uploaded!");
  } catch (error) {
    return res.status(500).send("File not uploaded!");
  }
});

module.exports = router;
