const { User } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .select("-__v")
      .then(async (users) => {
        return res.json(users);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      req.body,
      { new: true, runCalidators: true }
    )
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No such user exists" })
          : res.json(user)
      );
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No such user exists" })
          : res.json(user)
      )
      // .then((thoughts) =>
      //   !thoughts
      //     ? res.status(404).json({
      //         message: "User deleted, but no thoughts found",
      //       })
      //     : User.find(
      //         { user: req.params.userId.thoughtId },
      //         { $pull: { user: req.params.userId.thoughtId } },
      //         { new: true }
      //       )
      // )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a friend to user
  addFriend(req, res) {
    console.log("You are adding a friend");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove friend from a user
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
