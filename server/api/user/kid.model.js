'use strict';
/**
 * Created by HC on 2015/9/21.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var KidSchema = new Schema({
  name:String,
  birthday:Number,
  parent:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  avatar:String,
  boyOrGirl:String,
  level:{type:Number,default:1}, //等级
  account:{type:String,default: ''} //备用
});
module.exports = mongoose.model('Kid', KidSchema);
