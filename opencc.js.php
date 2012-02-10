function validateConfiguration() {
	if ($('#orig-type-simp').attr('checked')) {
		if ($('#tar-type-simp').attr('checked')) {
			//簡體到簡體
			return true;
		} else if ($('#tar-type-trad').attr('checked')) {
			//簡體到繁體
			if ($('#variant-type-opencc').attr('checked')) {
				//OpenCC異體字
				if ($('#region-phrase-type-disabled').attr('checked')) {
					//不轉換詞彙
					return 'zhs2zht.ini';
				} else if ($('#region-phrase-type-mainland').attr('checked')) {
					//大陸詞彙(TODO)
				} else if ($('#region-phrase-type-taiwan').attr('checked')) {
					//臺灣詞彙
					return 'zhs2zhtw_p.ini';
				}
			} else if ($('#variant-type-taiwan').attr('checked')) {
				//臺灣異體字
				if ($('#region-phrase-type-disabled').attr('checked')) {
					//不轉換詞彙
					return 'zhs2zhtw_v.ini';
				} else if ($('#region-phrase-type-mainland').attr('checked')) {
					//大陸詞彙(TODO)
				} else if ($('#region-phrase-type-taiwan').attr('checked')) {
					//臺灣詞彙
					return 'zhs2zhtw_vp.ini';
				}
			}
		}
	} else if ($('#orig-type-trad').attr('checked')) {
		if ($('#tar-type-simp').attr('checked')) {
			//繁體到簡體
			if ($('#region-phrase-type-disabled').attr('checked')) {
				//不轉換詞彙
				return 'zht2zhs.ini';
			} else if ($('#region-phrase-type-mainland').attr('checked')) {
				//大陸詞彙
				return 'zhtw2zhcn_s.ini';
			} else if ($('#region-phrase-type-taiwan').attr('checked')) {
				//臺灣詞彙（TODO）
			}
		} else if ($('#tar-type-trad').attr('checked')) {
			//繁體到繁體
			if ($('#variant-type-opencc').attr('checked')) {
				//OpenCC異體字
				if ($('#region-phrase-type-disabled').attr('checked')) {
					//不轉換詞彙
					return true;
				} else if ($('#region-phrase-type-mainland').attr('checked')) {
					//大陸詞彙
					return 'zhtw2zhcn_t.ini';
				} else if ($('#region-phrase-type-taiwan').attr('checked')) {
					//臺灣詞彙
					return 'zht2zhtw_p.ini';
				}
			} else if ($('#variant-type-taiwan').attr('checked')) {
				//臺灣異體字
				if ($('#region-phrase-type-disabled').attr('checked')) {
					//不轉換詞彙
					return 'zht2zhtw_v.ini';
				} else if ($('#region-phrase-type-mainland').attr('checked')) {
					//大陸詞彙(TODO)
				} else if ($('#region-phrase-type-taiwan').attr('checked')) {
					//臺灣詞彙
					return 'zht2zhtw_vp.ini';
				}
			}
		}
	} else if ($('#orig-type-mixed').attr('checked')) {
		//簡繁混雜
		if ($('#tar-type-simp').attr('checked')) {
			if ($('#region-phrase-type-disabled').attr('checked')) {
				//不轉換詞彙
				return 'mix2zhs.ini';
			} else if ($('#region-phrase-type-mainland').attr('checked')) {
				//大陸詞彙（TODO）
			} else if ($('#region-phrase-type-taiwan').attr('checked')) {
				//臺灣詞彙（TODO）
			}
		} else if ($('#tar-type-trad').attr('checked')) {
			if ($('#variant-type-opencc').attr('checked')) {
				//OpenCC異體字
				if ($('#region-phrase-type-disabled').attr('checked')) {
					//不轉換詞彙
					return 'mix2zht.ini';
				} else if ($('#region-phrase-type-mainland').attr('checked')) {
					//大陸詞彙(TODO)
				} else if ($('#region-phrase-type-taiwan').attr('checked')) {
					//臺灣詞彙(TODO)
				}
			} else if ($('#variant-type-taiwan').attr('checked')) {
				//臺灣異體字
				if ($('#region-phrase-type-disabled').attr('checked')) {
					//不轉換詞彙(TODO)
				} else if ($('#region-phrase-type-mainland').attr('checked')) {
					//大陸詞彙(TODO)
				} else if ($('#region-phrase-type-taiwan').attr('checked')) {
					//臺灣詞彙(TODO)
				}
			}
		}
	}
	return undefined;
}

function parseResults(jsontext) {
	var results = JSON.parse(jsontext);
	for (var i in results) {
		var candidates = results[i];
		var orig = candidates[0];
		var candidates_len = candidates.length;
		for (var j = 1; j < candidates_len; j++) {
			var word = candidates[j];
			
		}
	}
}

function sendRequests(arg, callback) {
	var config = arg['config'];
	var pricise = arg['pricise'];
	var text = $('#text').val();
	
	if (text.length > 10240) {
		callback('文字內容過長，請使用本地版本轉換。');
		return;
	}
	
	var request = $.ajax({
		url: 'http://www.byvoid.com/application/opencc-web/opencc.php',
		type: 'POST',
		data: {
			text: text,
			config: config,
			pricise: pricise,
			client: "<?php echo $_SERVER['REMOTE_ADDR'] ?>"
		},
	});

	request.done(function(msg) {
		callback(undefined, msg);
	});

	request.fail(function(jqXHR, textStatus) {
		callback(textStatus);
	});
}

function doConvert(event) {
	var pricise = event.data && event.data['precise'];

	$('#convert').button('disable');
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
		pricise: pricise,
	}, function(err, text) {
		if (err) {
			if (err == 'error') {
				err = '請求發送失敗。';
			}
			$('#dialog-request-error p').html(err);
			$('#dialog-request-error').dialog({
				height: 140,
				modal: true,
			});
		} else {
			if (pricise) {
				parseResults(text);
			} else {
				$('#text').val(text);
			}
		}
		resetProgress();
	});
}

function resetProgress() {
	$('#text').fadeTo('fast', 1);
	$('#text').removeAttr('readonly');
	$('#convert').button('enable');
}

$(function() {
	$('#main-tabs').tabs();
	$('#orig-type').buttonset();
	$('#tar-type').buttonset();
	$('#variant-type').buttonset();
	$('#region-phrase-type').buttonset();
	$('#convert').button();
	$('#precise-convert').button();
	
	$('#tar-type-simp').click(function() {
		$('#variant-type').hide('fast');
	});
	$('#tar-type-trad').click(function() {
		$('#variant-type').show('fast');
	});
	
	$('#text').width('100%');
	$('#convert').click(doConvert);
	$('#precise-convert').click({
		precise: true,
	}, doConvert);
});
