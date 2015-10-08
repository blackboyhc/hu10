/**
 * Created by HC on 2015/9/16.
 */
var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');
var mkdirs = module.exports.mkdirs = function(dirpath, mode, callback) {
  fs.exists(dirpath, function(exists) {
    if(exists) {
      callback(dirpath);
    } else {
      //尝试创建父目录，然后再创建当前目录
      mkdirs(path.dirname(dirpath), mode, function(){
        fs.mkdir(dirpath, mode, callback);
      });
    }
  });
};

exports.upload = function (req, res) {
  var uploadPath = './uploads/';
  var form = new multiparty.Form({uploadDir: uploadPath});
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }
    var author = fields.author;
    var fileName = path.basename(files.file[0].path);
    if (author) {
      var dstPath = uploadPath + author + '/imgs/';
      mkdirs(dstPath,'777',function(dirpath){
        fs.rename(files.file[0].path, dstPath + fileName, function (err) {
          //if (err) {
          //  console.log('rename error: ' + err);
          //} else {
          //  console.log('rename ok');
          //}
        });
      });
    }
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end(fileName);
  });
};


