const express = require("express");
const auth = require("./../middleware/auth");
const admin = require("./../middleware/admin");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

require("dotenv").config();

const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const mongoURI = `mongodb+srv://${user}:${password}@cluster0.g1ooo.mongodb.net/${database}?retryWrites=true&w=majority`;

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  UseUnifiedTopology: true,
});

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("Storage Connected");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// @route GET /
router.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map((file) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render("index", { files: files });
    }
  });
});

// @route POST /upload
router.post(
  "/upload",
  [auth, admin],
  upload.array("file", 8),
  async (req, res) => {
    await res.status(200).json({ message: "Dman", file: req.files });
  }
);

// @route GET /files

router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }

    return res.status(200).json(files);
  });
});

// @route GET /files/:filename
router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    return res.json(file);
  });
});

// @route GET /image/:filename => Display Image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

// @route DELETE /files/:id
router.delete("/files/:filename", [auth, admin], (req, res) => {
  gfs.remove(
    { filename: req.params.filename, root: "uploads" },
    (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      } else {
        return res.status(200).json({
          message: `File with ID ${req.params.filename} deleted`,
        });
      }
    }
  );
});

module.exports = router;
