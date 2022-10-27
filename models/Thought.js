const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
// Schema to create a Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);
// Create a virtual called timeStamp that formats the date
thoughtSchema.virtual("timeStamp").get(function () {
  return this.createdAt.toString().slice(0, 15);
});

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
