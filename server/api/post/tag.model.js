'use strict';
/**
 * Created by HC on 2015/9/21.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var TagSchema = new Schema({
  content: String,
  createDate: { type: Number, default: Date.now, index: true},
  useCount: { type: Number, default: 1}
});

module.exports = mongoose.model('Tag', TagSchema);
