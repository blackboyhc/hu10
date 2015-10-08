'use strict';

angular.module('hu10App')
  .controller('SettingsCtrl', function ($scope, User, Auth, UploadFile) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();
    $scope.isAvatarsCollapsed = true;
    $scope.avatars = ['little_boy_black.png','little_boy_blue.png','little_boy_green.png','little_boy_orange.png',
                       'little_boy_purple.png','little_boy_red.png','little_boy_white.png','little_boy_yellow.png',
                       'little_girl_black.png','little_girl_blue.png','little_girl_green.png','little_girl_pink.png',
                       'little_girl_purple.png','little_girl_red.png','little_girl_white.png','little_girl_yellow.png'];
    $scope.newUser = {
      name:$scope.user.name,
      signature:$scope.user.signature,
      avatar:''
    };
    $scope.kid = {
      name:'',
      birthday:0,
      avatar:'avatar_default.png',
      boyOrGirl:''
    };
    $scope.changePassword = function(form) {
      $scope.cpFormSubmitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.newUser.oldPassword, $scope.newUser.newPassword )
        .then( function() {
          $scope.message1 = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message1 = '';
        });
      }
		};
    $scope.addKid = function(form) {
      $scope.addKidFormSubmitted = true;
      if($scope.kid.boyOrGirl === ''){
        form.boyOrGirl.$setValidity('required', false);
      }
      if(form.$valid) {
        var birthday = new Date($scope.kid.birthday).getTime();
        Auth.addKids( $scope.kid.name,birthday,$scope.kid.boyOrGirl,$scope.kid.avatar)
          .then( function() {
            $scope.message2 = 'Add kid successful';
          })
          .catch( function() {
            $scope.message2 = 'Add kid failed';
          });
      }
    };
    $scope.changeProfile = function (form) {
      $scope.profileSubmitted = true;
      if(form.$valid) {
        if($scope.newUser.avatar && $scope.newUser.avatar !== 'assets/images/avatar_default.png'){
          UploadFile.uploadFiles([$scope.newUser.avatar], function (err) {
            if (err) {
              $scope.message3 = 'Change avatar failed';
            } else {
              $scope.doChangeProfile($scope.newUser.avatar.result);
            }
          });
        }else{
          $scope.doChangeProfile($scope.user.avatar);
        }
      }
    };
    $scope.doChangeProfile = function(avatar){
      Auth.changeProfile( $scope.newUser.name, $scope.newUser.signature, avatar)
        .then( function() {
          $scope.message3 = '修改成功';
        })
        .catch( function() {
          $scope.message3 = '修改失败';
        });
    };
    $scope.chooseKidAvatar = function(form,avatar){
      $scope.isAvatarsCollapsed = true;
      $scope.kid.avatar=avatar;
    };
    $scope.chooseBoyOrGirl = function(form){
      form.boyOrGirl.$setValidity('required', true);
    };
  });
