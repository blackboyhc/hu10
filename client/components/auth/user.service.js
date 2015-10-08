'use strict';

angular.module('hu10App')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller',
      {
        id: '@_id'
      },
      {
        changePassword: {
          method: 'PUT',
          params: {
            controller: 'password'
          }
        },
        changeProfile: {
          method: 'PUT',
          params: {
            controller: 'profile'
          }
        },
        addKids: {
          method: 'PUT',
          params: {
            controller: 'addkids'
          }
        },
        get: {
          method: 'GET',
          params: {
            id: 'me'
          }
        }
      });
  });
