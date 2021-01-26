const Joi = require("joi");
const mongoose = require("mongoose");
const { schema: postSchema } = require("./posts");

function validateComment(comment) {
  return Joi.validate(comment, {
    userId: Joi.objectId(),
    content: Joi.string().min(5).max(100).required(),
    postId: Joi.objectId().required(),
    accepted: Joi.boolean().required(),
  });
}

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    user: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          minlength: 5,
          maxlength: 255,
        },
        isAdmin: {
          type: Boolean,
          required: true,
          default: false,
        },
      }),
    },
    content: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    post: {
      type: postSchema,
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  })
);

module.exports.Comment = Comment;
module.exports.validate = validateComment;
