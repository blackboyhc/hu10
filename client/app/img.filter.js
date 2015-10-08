/**
 * Created by HC on 2015/9/24.
 */
'use strict';

angular.module('hu10App')
.filter('ImgSrcComplete',function(){
    return function(src,account,useFor){
      if(!src || src.length === 0){
        if(useFor === 'avatar'){
          return 'assets/images/avatar_default.png';
        }
      }else{
        return '/'+account+'/imgs/' + src;
      }
      return '';
    };
  });
