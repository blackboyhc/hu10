'use strict';

var User = require('./user.model');
var Kid = require('./kid.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};


/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};
/**
 * Change user's profile
 */
exports.changeProfile = function(req, res, next) {
  var userId = req.user._id;
  var name = String(req.body.name);
  var signature = String(req.body.signature);
  var avatar = String(req.body.avatar);

  User.findById(userId, function (err, user) {
    if(user) {
      user.name = name;
      user.signature = signature;
      user.avatar = avatar;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};
/**
 *
 */
exports.addKids = function(req, res, next) {
  var parent = req.user._id;
  var name = String(req.body.name);
  var birthday = req.body.birthday;
  var avatar = String(req.body.avatar);
  var boyOrGirl = String(req.body.boyOrGirl);
  var newKid = new Kid({
    name:name,
    birthday:birthday,
    parent:[parent],
    avatar:avatar,
    boyOrGirl:boyOrGirl
  });
  newKid.save(function(err, kid) {
    if (err) return validationError(res, err);
    User.findById(parent, function (err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      user.kids.push(kid._id);
      user.save(function(err, kid) {
        if (err) return next(err);
        res.status(200).json(user);
      });
    });
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({_id: userId})
    .populate({
      path: 'kids',
      select: '-parent'
    })
    .select('-salt -hashedPassword')
    .exec(function(err, user) { // don't ever give out the password or salt
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      res.json(user);
    });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  User.findOne({_id: userId})
    .populate({
      path: 'kids',
      select: '-parent'
    })
    .select('-salt -hashedPassword -invite -role')
    .exec(function(err, user) { // don't ever give out the password or salt
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized');
      res.json(user);
    });
};
/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
