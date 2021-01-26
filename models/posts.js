const Joi = require("joi");
const mongoose = require("mongoose");

function validatePost(post) {
  return Joi.validate(post, {
    title: Joi.string().min(5).max(100).required(),
    content: Joi.string().min(0).max(10000).required(),
    images: Joi.array().items(Joi.string()),
  });
}

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 10000,
  },
  images: {
    type: Array,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports.Post = Post;
module.exports.schema = postSchema;
module.exports.validate = validatePost;
