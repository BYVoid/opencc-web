const opencc = require('opencc');
const marked = require('marked');
const fs = require('fs');

exports.index = function (req, res) {
  res.render('index');
};

exports.convert = function(req, res) {
  var text = req.body.text;
  var config = req.body.config;
  var precise = req.body.precise == '1';
  
  // Escape all slashes
  config = config.replace(/\//g, "");
  var openccInst = new opencc(config);
  var converted = '';
  // if (!precise) {
    converted = openccInst.convertSync(text);
  // } else {
  //   var results = [];
  //   openccInst.setConversionMode(opencc.CONVERSION_SEGMENT_ONLY);
  //   var segments = openccInst.convertSync(text);
  //   segments = segments.split(' ');
  //   openccInst.setConversionMode(opencc.CONVERSION_LIST_CANDIDATES);
  //   var blank = false;
  //   for (var i = 0; i < segments.length; i++) {
  //     var word = segments[i];
  //     if (word === '') {
  //       if (blank) {
  //         blank = false;
  //         results.push([' ', ' ']);
  //       } else {
  //         blank = true;
  //       }
  //       continue;
  //     }
  //     var candidates = openccInst.convertSync(word);
  //     candidates = candidates.split(' ');
  //     candidates.unshift(word);
  //     results.push(candidates);
  //   }
  //   converted = JSON.stringify(results);
  // }
  res.end(converted);
};
