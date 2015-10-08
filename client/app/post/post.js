'use strict';

angular.module('hu10App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('post-show', {
        url: '/',
        templateUrl: 'app/post/show/list.html',
        controller: 'PostShowCtrl',
        authenticate: true
      })
      .state('post-show-ofwho', {
        url: '/ofwho/:userId',
        templateUrl: 'app/post/show/list.html',
        controller: 'PostShowCtrl',
        authenticate: true
      })
      .state('post-edit', {
        url: '/add',
        templateUrl: 'app/post/add/add.html',
        controller: 'PostEditCtrl',
        authenticate: true
      })
      .state('post-detail', {
        url: '/post/:postId',
        templateUrl: 'app/post/show/detail.html',
        controller: 'PostDetailCtrl',
        authenticate: true
      });
  });
