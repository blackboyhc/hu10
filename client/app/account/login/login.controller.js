'use strict';

angular.module('hu10App')
  .controller('LoginCtrl', function ($scope, Auth, $location,$rootScope) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          account: $scope.user.account,
          password: $scope.user.password
        })
        .then( function(user) {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
