function validateConfiguration() {
  var orig = $('input[name=orig-type]:checked').val();
  var tar = $('input[name=tar-type]:checked').val();
  var variant = $('input[name=variant-type]:checked').val();
  var idiom = $('input[name=idiom-type]:checked').val();

  if (orig === 'simp') {
    if (tar === 'simp') {
      //簡體到簡體
      return true;
    } else if (tar === 'trad') {
      //簡體到繁體
      if (variant === 'opencc') {
        //OpenCC異體字
        if (idiom === 'disabled') {
          //不轉換詞彙
          return 's2t.json';
        } else if (idiom === 'mainland') {
          //大陸詞彙(TODO)
        } else if (idiom === 'taiwan') {
          //臺灣詞彙(TODO)
        }
      } else if (variant === 'taiwan') {
        //臺灣異體字
        if (idiom === 'disabled') {
          //不轉換詞彙
          return 's2tw.json';
        } else if (idiom === 'mainland') {
          //大陸詞彙(TODO)
        } else if (idiom === 'taiwan') {
          //臺灣詞彙
          return 's2twp.json';
        }
      } else if (variant === 'hongkong') {
        // 香港異體字
        if (idiom === 'disabled') {
          //不轉換詞彙
          return 's2hk.json';
        } else if (idiom === 'mainland') {
          //大陸詞彙(TODO)
        } else if (idiom === 'taiwan') {
          //臺灣詞彙(TODO)
        }
      }
    }
  } else if (orig === 'trad') {
    if (tar === 'simp') {
      //繁體到簡體
      if (idiom === 'disabled') {
        //不轉換詞彙
        return 't2s.json';
      } else if (idiom === 'mainland') {
        //大陸詞彙
        return 'tw2sp.json';
      } else if (idiom === 'taiwan') {
        //臺灣詞彙（TODO）
      }
    } else if (tar === 'trad') {
      //繁體到繁體
      if (variant === 'opencc') {
        //OpenCC異體字
        if (idiom === 'disabled') {
          //不轉換詞彙
          return true;
        } else if (idiom === 'mainland') {
          //大陸詞彙
        } else if (idiom === 'taiwan') {
          //臺灣詞彙
        }
      } else if (variant === 'taiwan') {
        //臺灣異體字
        if (idiom === 'disabled') {
          //不轉換詞彙
          return 't2tw.json';
        } else if (idiom === 'mainland') {
          //大陸詞彙(TODO)
        } else if (idiom === 'taiwan') {
          //臺灣詞彙
        }
      } else if (variant === 'hongkong') {
        // 香港異體字
        if (idiom === 'disabled') {
          //不轉換詞彙
          return 't2hk.json';
        } else if (idiom === 'mainland') {
          //大陸詞彙(TODO)
        } else if (idiom === 'taiwan') {
          //臺灣詞彙(TODO)
        }
      }
    } else if (tar === 'jpshinjitai') {
      // 繁體 -> 日文新字體
      return 't2jp.json';
    }
  } else if (orig === 'jpshinjitai') {
    if (tar === 'trad') {
      // 日文新字體 -> 繁體
      return 'jp2t.json';
    }
  }
  return undefined;
}

function parseResults(jsontext) {
  var res = JSON.parse(jsontext);
  var proof = $('#proof');

  proof.html('');
  for (var i in res) {
    var candidates = res[i];
    var orig = candidates[0];
    if (orig == '\n') {
      proof.append('<br />');
      continue;
    }
    if (orig == ' ') {
      proof.append('&nbsp;');
      continue;
    }
    if (orig == '\t') {
      proof.append('&nbsp;&nbsp;&nbsp;&nbsp;');
      continue;
    }
    var def = candidates[1];
    var spanId = 'word_' + i;
    proof.append('<span id="' + spanId + '"><a href="#"></a></span>');
    var newSpan = $('#' + spanId, proof);
    if (candidates.length > 2) {
      newSpan.addClass('multicorrespond');
    } else {
      newSpan.addClass('singlecorrespond');
    }
    $('a', newSpan).text(def);
  }
  var wordCount = res.length;
  for (var i = 0; i < wordCount; i++) {
    $('#proof #word_' + i + ' a').click({
      id: i,
    }, function (event) {
      var id = event.data.id;
      var candidates = res[id];
      var original = candidates[0];

      var selDialog = $('#selector');
      var candList = $('ul', selDialog);

      candList.html('');
      for (var j = 1; j < candidates.length; j++) {
        var cand = candidates[j];
        candList.append('<li><button id="' + j + '">' + cand + '</button></li>');
        var btn = $('button', candList).last();
        btn.button();
        btn.click({
          index: j,
        },
          function (event) {
            var index = event.data.index;
            var selCand = candidates[index];
            var span = $('#proof #word_' + id);
            span.addClass('fixedmulticorrespond');
            span.removeClass('multicorrespond');
            $('a', span).html(selCand);
            selDialog.dialog('close');
          });
      }
      selDialog.dialog({
        'title': original
      });
      return false;
    });
  }
}

function sendRequests(arg, callback) {
  var config = arg['config'];
  var precise = arg['precise'];
  var text = $('#text').val();

  if (text.length > 10240) {
    callback('文字內容過長，請使用本地版本轉換。');
    return;
  }

  var request = $.ajax({
    url: '/convert',
    type: 'POST',
    data: {
      text: text,
      config: config,
      precise: precise
    },
  });

  request.done(function (msg) {
    callback(undefined, msg);
  });

  request.fail(function (jqXHR, textStatus) {
    callback(textStatus);
  });
}

function doConvert(event) {
  var precise = event.data && event.data['precise'];

  $('#convert').button('disable');
  $('#precise-convert').button('disable');
  $('#text').attr('readonly', 'readonly');
  $('#text').fadeTo('fast', 0.5);

  var config = validateConfiguration();
  if (!config) {
    $('#dialog-config-error').dialog({
      height: 140,
      modal: true
    });
    resetProgress();
    return;
  }

  if (config === true) {
    resetProgress();
    return;
  }

  sendRequests({
    config: config,
    precise: precise,
  }, function (err, text) {
    if (err) {
      if (err == 'error') {
        err = '請求發送失敗。';
      }
      $('#dialog-request-error p').html(err);
      $('#dialog-request-error').dialog({
        height: 140,
        modal: true,
      });
      return;
    }
    if (precise) {
      $('#proof').show('fast');
      $('#text').hide();
      $('#convert').hide('fast');
      $('#precise-convert').hide('fast');
      $('#new-convert').show('fast');
      parseResults(text);
      return;
    } else {
      $('#text').val(text);
    }
    resetProgress();
  });
}

function resetProgress() {
  $('#text').fadeTo('fast', 1);
  $('#text').removeAttr('readonly');
  $('#convert').button('enable');
  $('#precise-convert').button('enable');
  $('#convert').show();
  $('#precise-convert').show();
  $('#new-convert').hide();
  $('#proof').hide();
}

$(function () {
  $('#main-tabs').tabs();
  $('#orig-type').buttonset();
  $('#tar-type').buttonset();
  $('#variant-type').buttonset();
  $('#idiom-type').buttonset();
  $('#convert').button();
  $('#precise-convert').button();
  $('#new-convert').button();

  $('#tar-type-simp').click(function () {
    $('#variant-type').hide('fast');
    $('#idiom-type').show('fast');
  });
  $('#tar-type-trad').click(function () {
    $('#variant-type').show('fast');
    $('#idiom-type').show('fast');
  });
  $('#tar-type-jpshinjitai').click(function () {
    $('#variant-type').hide('fast');
    $('#idiom-type').hide('fast');
  });

  $('#text').width('100%');
  $('#convert').click({
    precise: 0,
  }, doConvert);
  $('#precise-convert').click({
    precise: 1,
  }, doConvert);
  $('#new-convert').click(resetProgress).hide();
});
