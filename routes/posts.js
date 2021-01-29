const express = require("express");
const path = require("path");
const fs = require("fs");
const admin = require("./../middleware/admin");
const auth = require("./../middleware/auth");
const validateObjectId = require("./../middleware/validateObjectId");
const { Post, validate } = require("./../models/posts");
const router = express.Router();

router.get("/", async function handle(req, res) {
  const posts = await Post.find();
  res.send(posts);
});

router.get("/:id", validateObjectId, async function handle(req, res) {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).send(`There is no post with id ${req.params.id}`);
  res.send(post);
});

router.post("/", [auth, admin], async function handle(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await new Post({ ...req.body });
  const renamedImageFilenames = [];
  if (req.body.images) {
    req.body.images.forEach(function rename(image, index) {
      renamedImageFilenames.push(
        `/media/${`${post._id}_${index}${path.extname(image)}`}`
      );
    });
    post.set("images", renamedImageFilenames);
  }

  post.save();

  res.send(post);
});

router.put(
  "/:id",
  [auth, admin, validateObjectId],
  async function handle(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const renamedImageFilenames = [];
    if (req.body.images) {
      req.body.images.forEach(function rename(image, index) {
        renamedImageFilenames.push(
          `/media/${`${req.params.id}_${index}${path.extname(image)}`}`
        );
      });
      req.body.images = [...renamedImageFilenames];
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!post)
      return res.status(404).send(`There is no post with id ${req.params.id}`);
    res.send(post);
  }
);

router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  async function handle(req, res) {
    const post = await Post.findByIdAndRemove(req.params.id);

    if (!post)
      return res.status(404).send(`There is no post with id ${req.params.id}`);

    const mediaPath = `${process.cwd()}/media`;
    fs.readdir(mediaPath, function (err, files) {
      if (err) {
        console.log(err);
        return;
      }

      files
        .filter(function match(file) {
          return file.match(
            new RegExp(`^${req.params.id}_\\d+.(png|PNG|jpg|JPG|mp4|MP4)$`)
          );
        })
        .forEach(function remove(file) {
          try {
            fs.unlinkSync(`${mediaPath}/${file}`);
          } catch (error) {
            console.log(error);
          }
        });
    });

    res.send(post);
  }
);

module.exports = router;
