'use strict';

angular.module('hu10App')
  .controller('PostEditCtrl', function ($scope, Post, UploadFile, $location) {
    $scope.post = {};
    $scope.errors = {};
    $scope.picFiles = [];
    $scope.sendPost = function (form,files) {
      Post.addPost({
        title: $scope.post.title,
        content: $scope.post.content,
        mediaUrl: files,
        tags:$scope.post.tags
    })
        .then(function () {
          // Account created, redirect to home
          $location.path('/');
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
    };
    $scope.addPost = function (form) {
      $scope.submitted = true;
      if (form.$valid) {
        var files = [];
        if ($scope.picFiles.length > 0) {
          UploadFile.uploadFiles($scope.picFiles, function (err) {
            if (err) {
              console.info(err);
            } else {
              for (var i = 0; i < $scope.picFiles.length; i++) {
                files[i] = $scope.picFiles[i].result;
              }
              $scope.sendPost(form,files);
            }
          });
        } else {
          $scope.sendPost(form,files);
        }
      }
    };

    $scope.removePic = function (index) {
      $scope.picFiles.splice(index, 1);
    };
    $scope.validateUpload = function(){
      if($scope.picFiles.length > 6){
        $scope.picFiles.splice(6,$scope.picFiles.length-6);
      }
    };
    $scope.tags = [];
    Post.listTag(function(tags){
      $scope.tags = tags;
    });

    $scope.appendTag = function(tag){
      if($scope.post.tags){
        $scope.post.tags += ',' + tag;
      }else{
        $scope.post.tags = tag;
      }
    };
  });
