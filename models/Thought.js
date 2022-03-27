const {Schema,model} = require('mongoose');
const reactionSchema = require('./Reaction.js');

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [ReactionSchema]
}, {
  toJSON: {
    getters: true,
    virtuals: true
  },
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});


const Thought = model('Thought', thoughtSchema);
module.exports = Thought;