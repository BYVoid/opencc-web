const opencc = require('opencc');
const marked = require('marked');

const configs = ['s2t', 't2s', 's2tw', 'tw2s', 's2hk', 'hk2s', 's2twp',
  'tw2sp', 't2tw', 't2hk', 't2jp', 'jp2t'];
const instances = {};
configs.forEach((configName) => {
  const config = configName + '.json';
  instances[config] = new opencc(config);
});

exports.index = function (req, res) {
  res.render('index');
};

exports.convert = function (req, res) {
  var text = req.body.text;
  const config = req.body.config;
  var precise = req.body.precise == '1';

  if (!instances[config]) {
    return res.status(500).end('Invalid config.');
  }

  var openccInst = new opencc(config);
  // if (!precise) {
  openccInst.convert(text, function(err, converted) {
    if (err) {
      res.status(500).end(err);
    }
    res.end(converted);
  });
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
};
