'use strict';

angular.module('hu10App')
  .controller('SettingsCtrl', function ($scope, User, Auth, UploadFile) {
    $scope.errors = {};
    $scope.currentUser = Auth.getCurrentUser();
    console.info($scope.currentUser);
    $scope.isAvatarsCollapsed = true;
    $scope.avatars = ['little_boy_black.png','little_boy_blue.png','little_boy_green.png','little_boy_orange.png',
                       'little_boy_purple.png','little_boy_red.png','little_boy_white.png','little_boy_yellow.png',
                       'little_girl_black.png','little_girl_blue.png','little_girl_green.png','little_girl_pink.png',
                       'little_girl_purple.png','little_girl_red.png','little_girl_white.png','little_girl_yellow.png'];
    //$scope.newUser = {
    //  name:$scope.currentUser.name,
    //  signature:$scope.currentUser.signature,
    //  avatar:''
    //};
    $scope.newUser = $scope.currentUser;
    $scope.kid = {
      _id:null,
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
            $scope.showAlert('success','修改成功');
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = '密码不正确';
            $scope.showAlert('warning','修改失败');
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
          .then( function(kid) {
            $scope.currentUser.kids.push(kid);
            $scope.showAlert('success','添加成功');
          })
          .catch( function() {
            $scope.showAlert('warning','添加失败');
          });
      }
    };
    $scope.changeProfile = function (form) {
      $scope.profileSubmitted = true;
      if(form.$valid) {
        if($scope.newUser.avatar && $scope.newUser.avatar !== 'assets/images/avatar_default.png'){
          UploadFile.uploadFiles([$scope.newUser.avatar], function (err) {
            if (err) {
              $scope.showAlert('warning','修改头像失败');
            } else {
              $scope.doChangeProfile($scope.newUser.avatar.result);
            }
          });
        }else{
          $scope.doChangeProfile($scope.currentUser.avatar);
        }
      }
    };
    $scope.doChangeProfile = function(avatar){
      Auth.changeProfile( $scope.newUser.name, $scope.newUser.signature, avatar)
        .then( function(user) {
          $scope.showAlert('success','修改成功');
        })
        .catch( function() {
          $scope.showAlert('warning','修改失败');
        });
    };
    $scope.chooseKidAvatar = function(form,avatar){
      $scope.isAvatarsCollapsed = true;
      $scope.kid.avatar=avatar;
    };
    $scope.chooseBoyOrGirl = function(form){
      form.boyOrGirl.$setValidity('required', true);
    };


    $scope.alerts = [
    ];

    $scope.showAlert = function(type,msg) {
      $scope.alerts.push({type:type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  });
