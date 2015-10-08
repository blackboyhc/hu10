/**
 * Created by HC on 2015/9/24.
 */
'use strict';

angular.module('hu10App')
  .factory('UploadFile', function ($location, $rootScope, $http, $q, Auth, Upload, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var currentUser = Auth.getCurrentUser();
    return {
      uploadFiles: function(files,callback){
        var result = 0;
        angular.forEach(files, function(file) {
          if (file && !file.$error) {
            file.upload = Upload.upload({
              url: '/api/fileUpload',
              file: file,
              fields: {'author': currentUser.account}
            });

            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
                result++;
                if(result === files.length){
                  callback();
                }
              });
            }, function (response) {
              if (response.status > 0){
                var err = response.status + ': ' + response.data;
                callback(err);
              }
            });

            file.upload.progress(function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
          }
        });
      }
    };
  });
