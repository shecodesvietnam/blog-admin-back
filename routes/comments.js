const express = require("express");
const { Comment, validate } = require("./../models/comments");
const { User } = require("./../models/users");
const { Post } = require("./../models/posts");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async function handle(req, res) {
  const comments = await Comment.find();
  res.send(comments);
});

router.post("/", async function handle(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;
  if (req.body.userId) {
    user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(404)
        .send(`There is no user with id ${req.body.userId}`);
  }

  const post = await Post.findById(req.body.postId);
  if (!post)
    return res.status(404).send(`There is no post with id ${req.body.postId}`);

  if (user && !user.isAdmin && req.body.accepted) req.body.accepted = false;

  const comment = await new Comment({
    user: user && {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    content: req.body.content,
    post,
    accepted: req.body.accepted,
  });

  comment.save();

  res.send(comment);
});

router.put("/:id", auth, async function handle(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!comment)
    return res.status(404).send(`There is no comment with id ${req.params.id}`);
  res.send(comment);
});

router.delete("/:id", auth, async function handle(req, res) {
  const comment = await Comment.findByIdAndRemove(req.params.id);

  if (!comment)
    return res.status(404).send(`There is no comment with id ${req.params.id}`);
  res.send(comment);
});

module.exports = router;
