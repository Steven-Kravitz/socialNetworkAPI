const {  User, Thought  } = require('../models');


module.exports = {
  // Get all Thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughtInfo) => res.json(thoughtInfo))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single Thoughts
  getSingleThoughts(req, res) {
    Thought.findOne({
        _id: req.params.thoughtId
      })
      .select('-__v')
      .then((thoughtInfo) =>
        !thoughtInfo ?
        res.status(404).json({
          message: 'No thoughts with that ID'
        }) :
        res.json(thoughtInfo)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new Thought
  createThought({
    body
  }, res) {
    Thought.create(body)
      .then(({
        username,
        _id
      }) => {
        return User.findOneAndUpdate({
          username: username
        }, {
          $push: {
            thoughts: _id
          }
        }, {
          runValidators: true,
          new: true
        });
      })
      .then((userInfo) =>
        !userInfo ?
        res
        .status(404)
        .json({
          message: "Thought created, but no user found",
        }) :
        res.json("Thought Created!")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Update a Thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({
        _id: req.params.thoughtId
      }, {
        $set: req.body
      }, {
        runValidators: true,
        new: true
      })
      .then((thoughtInfo) =>
        !thoughtInfo ?
        res.status(404).json({
          message: "No thought with this ID"
        }) :
        res.json(thoughtInfo)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Delete a Thought and remove them from the course
  deleteThought(req, res) {
    Thought.findOneAndRemove({
        _id: req.params.thoughtId
      })
      .then((thoughtInfo) =>
        !thoughtInfo ?
        res.status(404).json({
          message: 'No such Thought exists'
        }) :
        User.findOneAndUpdate({
          thoughts: req.params.thoughtId
        }, {
          $pull: {
            thoughts: req.params.thoughtId
          }
        }, {
          new: true
        })
      )
      .then((userInfo) =>
        !userInfo ?
        res.status(404).json({
          message: 'Thought deleted, but no user found',
        }) :
        res.json({
          message: 'Thought successfully deleted'
        })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a Reaction to a Thought
  addReaction(req, res) {
    Thought.findOneAndUpdate({
        _id: req.params.thoughtId
      }, {
        $addToSet: {
          reactions: req.body
        }
      }, {
        runValidators: true,
        new: true
      })
      .then((thoughtInfo) =>
        !thoughtInfo ?
        res
        .status(404)
        .json({
          message: 'No Thought found with that ID'
        }) :
        res.json(thoughtInfo)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove Reaction from a Thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate({
        _id: req.params.thoughtId
      }, {
        $pull: {
          reactions: {
            reactionId: req.params.reactionId
          }
        }
      }, {
        runValidators: true,
        new: true
      })
      .then((thoughtInfo) =>
        !thoughtInfo ?
        res
        .status(404)
        .json({
          message: 'No Thought found with that ID'
        }) :
        res.json(thoughtInfo)
      )
      .catch((err) => res.status(500).json(err));
  },
};