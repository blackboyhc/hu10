'use strict';

angular.module('hu10App')
  .controller('PostShowCtrl', function ($scope,$stateParams, Post, socket, Auth) {
    $scope.selUserId = $stateParams.userId;
    if (!$scope.currentUser) {
      $scope.currentUser = Auth.getCurrentUser();
      $scope.selUser = $scope.currentUser;
    }
    if (!$scope.posts) {
      if ($scope.selUserId) {
        Auth.getUserInfo($scope.selUserId)
          .then(function (ofwho) {
            $scope.selUser = ofwho;
          })
          .catch(function () {
          });
        Post.listPostOfWho($scope.selUserId, function (posts) {
          $scope.posts = posts;
        });
      } else {
        Post.listPost(function (posts) {
          $scope.posts = posts;
        });
      }
    }
    socket.syncUpdates('post', $scope.posts);
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('post');
    });
    $scope.isLiked = function(index){
      var contain = false;
      $.each($scope.posts[index].like,function(i, user){
        if(user._id === $scope.currentUser._id){
          contain = true;
          return false;
        }
      });
      return contain;
    };
    $scope.addOrRemoveLike = function(postId){
      Post.addOrRemoveLike(postId)
        .then(function () {

        })
        .catch(function (err) {
          err = err.data;
          $scope.errors = {};
        });
    };
    $scope.dynamicPopover = {
      templateUrl: 'pop_tpl.html',
      title: '扫二维码,加微信'
    };
  });
