const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommentSchema = new Schema(
  {
    id: Number,
    name: String,
    user_id: Number,
    share_id: Number,
    share: String,
    photo: String,
    timestamp: String,
  },
  { 
    timestamps: true, 
    toJSON: {virtuals: true}
  }
)

CommentSchema.virtual('share', {
  ref: 'Share',
  localField: 'share_id',
  foreignField: 'id',
  justOne: true
})

CommentSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: 'id',
  justOne: true
})

module.exports = mongoose.model('Comment', CommentSchema)