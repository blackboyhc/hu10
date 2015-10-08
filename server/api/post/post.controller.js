'use strict';

var _ = require('lodash');
var Post = require('./post.model');
var Comment = require('./comment.model');
var Tag = require('./tag.model');

// Get list of posts
exports.index = function (req, res) {
  Post.find()
    .populate([{
      path: 'author',
      select: '_id name account avatar'
    },{
      path: 'like',
      select: '_id name'
    }])
    .sort({createDate:-1})
    .exec(function (err, posts) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(posts);
    });
};
// Get list of posts of who
exports.listPostsOfWho = function (req, res) {
  Post.find({author:req.params.userId})
    .populate([{
      path: 'author',
      select: '_id name account avatar'
    },{
      path: 'like',
      select: '_id name'
    }])
    .sort({createDate:-1})
    .exec(function (err, posts) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(posts);
    });
};

// Get list of tags
exports.tags = function (req, res) {
  Tag.find({},'content useCount',{limit:20,sort: {useCount: -1}},function(err,tags){
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(tags);
  });
};

// Get a single post
exports.show = function (req, res) {
  Post
    .findById(req.params.id)
    .populate([{
      path: 'author',
      select: '-salt -hashedPassword'
    },
      {
      path: 'like',
      select: '-salt -hashedPassword'
    },
      {
      path: 'comments'
    }]) // only works if we pushed refs to children
    .exec(function (err, post) {
      if (err) {
        return handleError(res, err);
      }
      if (!post) {
        return res.status(404).send('Not Found');
      }
      var opts = [{
        path: 'comments.from',
        select: '_id name account avatar',
        model: 'User'
      },{
        path: 'comments.to',
        select: '_id name',
        model: 'User'
      }];
      Post.populate(post, opts, function (err, populatedPost) {
        return res.json(populatedPost);
      });
    });
};

// Creates a new post in the DB.
exports.create = function (req, res) {
  var author = req.body.author;
  if(!author){
    return res.status(403).send('Forbidden');
  }
  var content;
  Post.create(req.body, function (err, post) {
    if (err) {
      return handleError(res, err);
    }
    if(post.tags){
      for(var i = 0; i < post.tags.length; i++){
        content = post.tags[i];
        var query = Tag.findOne({content:content});
        handTag(query,content);
      }
    }
    return res.status(201).json(post);
  });
  function handTag(query,content){
    query.exec(function (err, tag) {
      if(!err){
        if(!tag){
          Tag.create({content:content},function (err) {
            if (err) {
              console.info(err);
            }
            //return res.status(200).json(post);
          });
        }else{
          tag.useCount++;
          tag.save(function (err) {
            if (err) {
              console.info(err);
            }
            //return res.status(200).json(post);
          });
        }
      }
    })

  }
};

// Creates a new post comment in the DB.
exports.addComment = function (req, res) {
  Comment.create(req.body, function (err, comment) {
    if (err) {
      return handleError(res, err);
    }
    Post.findById(req.body.postId, function (err, post) {
      if (err) {
        return handleError(res, err);
      }
      if (!post) {
        return res.status(404).send('Post Not Found');
      }
      post.comments.push(comment);
      post.save(function (err) {
        if (err) {
          return handleError(res, err);
        }
        //return res.status(200).json(post);
      });
    });
    return res.status(201).json(comment);
  });
};

// Add or remove like in the DB.
exports.addOrRemoveLike = function (req, res) {
  Post.findById(req.body.postId, function (err, post) {
    if (err) {
      return handleError(res, err);
    }
    if (!post) {
      return res.status(404).send('Post Not Found');
    }
    if(post.like.indexOf(req.body.userId) !== -1){
      post.like.pull(req.body.userId);
    }else {
      post.like.push(req.body.userId);
    }
    post.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(post);
    });
  });
};
// Updates an existing post in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Post.findById(req.params.id, function (err, post) {
    if (err) {
      return handleError(res, err);
    }
    if (!post) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(post, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(post);
    });
  });
};

// Deletes a post from the DB.
exports.destroy = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) {
      return handleError(res, err);
    }
    if (!post) {
      return res.status(404).send('Not Found');
    }
    post.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
