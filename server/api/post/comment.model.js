'use strict';
/**
 * Created by HC on 2015/9/21.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var CommentSchema = new Schema({
  content: String,
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId,default:null, ref: 'User' },
  createDate: { type: Number, default: Date.now, index: true},
  postId: { type: Schema.Types.ObjectId, ref: 'Post' }
});

module.exports = mongoose.model('Comment', CommentSchema);
