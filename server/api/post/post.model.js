'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var PostSchema = new Schema({
  title: String,
  content: String,
  tags: { type: [],default: []},
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createDate: { type: Number, default: Date.now, index: true},
  mediaUrl: {type: [], default: []},
  mediaType: {type: Number, default: 0},   //类型：0-图片，1-视频，2-音频
  thumbnail: {type: [], default: []},
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  like:[{ type: Schema.Types.ObjectId, ref: 'User' }]
});

PostSchema
  .virtual('tag')
  .set(function(tag) {
    this.tags = tag.split(',');
  })
  .get(function() {
    return this.tags.join(',');
  });
module.exports = mongoose.model('Post', PostSchema);
