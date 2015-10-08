'use strict';

angular.module('hu10App')
  .controller('PostDetailCtrl', function ($scope, $stateParams, Post, Auth) {
    $scope.postId = $stateParams.postId;
    $scope.user = Auth.getCurrentUser();
    $scope.touchUser = {};
    $scope.comment = '';
    Post.postDetail($scope.postId, function (post) {
      $scope.post = post;
    });
    $scope.isLiked = function(){
      var contain = false;
      if($scope.post){
        $.each($scope.post.like,function(i, user){
          if(user._id === $scope.user._id){
            contain = true;
            return false;
          }
        });
      }
      return contain;
    };
    $scope.addComment = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        var touchUserId;
        if($scope.touchUser){
          touchUserId = $scope.touchUser._id;
        }
        Post.addComment($scope.comment, $scope.postId, touchUserId)
          .then(function (comment) {
            comment.from = $scope.user;
            comment.to = $scope.touchUser;
            $scope.post.comments.push(comment);
            $scope.touchUser = {};
            $scope.comment = '';
          })
          .catch(function (err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
        $scope.submitted = false;
      }
    };
    $scope.touchWho = function(who){
      $scope.touchUser = who;
      console.info(who);
    };
    $scope.addOrRemoveLike = function(postId){
      var liked = $scope.isLiked();
      Post.addOrRemoveLike(postId)
        .then(function () {
          if(!liked) {
            $scope.post.like.push($scope.user);
          }
          else{
            $.each($scope.post.like,function(i, user){
              if(user._id === $scope.user._id){
                $scope.post.like.splice(i,1);
                return false;
              }
            });
          }

        })
        .catch(function (err) {
          err = err.data;
          $scope.errors = {};
        });
    };
  });
