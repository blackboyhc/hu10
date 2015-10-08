'use strict';

angular.module('hu10App')
  .factory('Post', function ($location, $rootScope, $http, $q, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var currentUser = Auth.getCurrentUser();
    return {
      addPost: function(post, callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/posts', {
          title: post.title,
          content: post.content,
          mediaUrl: post.mediaUrl,
          author:currentUser._id,
          tag:post.tags
        }).
          success(function(data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          });
        return deferred.promise;
      },
      listPost:function(callback){
        $http.get('/api/posts').success(function(posts) {
          callback(posts);
        });
      },
      listPostOfWho:function(userId,callback){
        $http.get('/api/posts/ofwho/' + userId).success(function(posts) {
          callback(posts);
        });
      },
      listTag:function(callback){
        $http.get('/api/posts/tags').success(function(tags) {
          callback(tags);
        });
      },
      postDetail:function(postId,callback){
        $http.get('/api/posts/' + postId).success(function(post) {
          callback(post);
        });
      },
      addComment:function(content,postId,to,callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/posts/comment', {
          content: content,
          from: currentUser._id,
          to:to,
          postId:postId
        }).
          success(function(data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          });
        return deferred.promise;
      },
      addOrRemoveLike:function(postId,callback){
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/api/posts/fav', {
          userId: currentUser._id,
          postId:postId
        }).
          success(function(data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function(err) {
            deferred.reject(err);
            return cb(err);
          });
        return deferred.promise;
      }
    };
  });
