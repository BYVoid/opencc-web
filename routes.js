var opencc = require('opencc');
var marked = require('marked');
var fs = require('fs');

var overviewText = marked(fs.readFileSync('views/overview.md', 'utf-8'));
var introText = marked(fs.readFileSync('views/intro.md', 'utf-8'));
var downloadText = marked(fs.readFileSync('views/download.md', 'utf-8'));

exports.index = function (req, res) {
  res.render('index', {
    overview: overviewText,
    intro: introText,
    download: downloadText
  });
};

exports.convert = function(req, res) {
  var text = req.body.text;
  var config = req.body.config;
  var precise = req.body.precise == '1';
  
  var openccInst = new opencc(config);
  var converted = '';
  if (!precise) {
    converted = openccInst.convertSync(text);
  } else {
    var results = [];
    openccInst.setConversionMode(opencc.CONVERSION_SEGMENT_ONLY);
    var segments = openccInst.convertSync(text);
    segments = segments.split(' ');
    openccInst.setConversionMode(opencc.CONVERSION_LIST_CANDIDATES);
    var blank = false;
    for (var i = 0; i < segments.length; i++) {
      var word = segments[i];
      if (word === '') {
        if (blank) {
          blank = false;
          results.push([' ', ' ']);
        } else {
          blank = true;
        }
        continue;
      }
      var candidates = openccInst.convertSync(word);
      candidates = candidates.split(' ');
      candidates.unshift(word);
      results.push(candidates);
    }
    converted = JSON.stringify(results);
  }
  res.end(converted);
};
