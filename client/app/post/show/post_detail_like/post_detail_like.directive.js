/**
 * Created by HC on 2015/9/22.
 */
'use strict';

angular.module('hu10App')
  .directive('postLike', function () {
    return {
      //scope:{
      //  post:'@'
      //},
      templateUrl: 'app/post/show/post_detail_like/post_detail_like.html',
      restrict: 'E',
      link: function (scope, element) {
        var span = element.find('.glyphicon-heart');
        span.bind('click', function(){
          scope.$apply(scope.addOrRemoveLike(scope.post._id));
        });
      }
    };
  });
