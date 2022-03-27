const {  User, Thought  } = require('../models');

module.exports = {
  // Get all Users
  getUsers(req, res) {
    User.find()
      .then((User) => res.json(User))
      .catch((err) => res.status(500).json(err));
  },
  // Get a User
  getSingleUser(req, res) {
    User.findOne({
        _id: req.params.UserId
      })
      .select('-__v')
      .then((userInfo) =>
        !userInfo ?
        res.status(404).json({
          message: 'No User with that ID'
        }) :
        res.json(userInfo)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a User
  createUser(req, res) {
    User.create(req.body)
      .then((userInfo) => res.json(userInfo))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a User
  deleteUser(req, res) {
    User.findOneAndDelete({
        _id: req.params.UserId
      })
      .then((userInfo) =>
        !userInfo ?
        res.status(404).json({
          message: 'No User with that ID'
        }) :
        Thought.deleteMany({
          _id: {
            $in: User.thoughts
          }
        })
      )
      .then(() => res.json({
        message: 'User and Thoughts deleted!'
      }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a User
  updateUser(req, res) {
    User.findOneAndUpdate({
        _id: req.params.UserId
      }, {
        $set: req.body
      }, {
        runValidators: true,
        new: true
      })
      .then((userInfo) =>
        !userInfo ?
        res.status(404).json({
          message: 'No User with this id!'
        }) :
        res.json(userInfo)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate({
        _id: req.params.userId
      }, {
        $addToSet: {
          friends: req.params.friendId
        }
      }, {
        runValidators: true,
        new: true
      })
      .then((userInfo) =>
        !userInfo ?
        res.status(404).json({
          message: "No user found with that ID"
        }) :
        res.json(userInfo)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend
  removeFriend(req, res) {
    User.findOneAndUpdate({
        _id: req.params.userId
      }, {
        $pull: {
          friends: req.params.friendId
        }
      }, {
        runValidators: true,
        new: true
      })
      .then((userInfo) =>
        !userInfo ?
        res
        .status(404)
        .json({
          message: 'No friend found with that ID'
        }) :
        res.json(userInfo)
      )
      .catch((err) => res.status(500).json(err))
  }
};