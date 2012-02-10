<?php
function write_log($client, $config, $text_in)
{
	$file_name = time() . '_' . $client . '.log';
	$text = 'Config: ' . $config . "\n" . "\n" . $text_in;
	$path = './log/' . $file_name;
	file_put_contents($path, $text);
}

function convert_precise($text_in, $config)
{
	$od = opencc_open($config);
	opencc_set_consersion_mode($od, 1);
	$segmented_text = opencc_convert($od, $text_in);
	$segments = explode(' ', $segmented_text);
	
	$results = array();
	opencc_set_consersion_mode($od, 2);
	foreach ($segments as $word)
	{
		$results[] = opencc_convert($od, $word);
	}
	opencc_close($od);
	
	print_r($results);
}

function get_and_convert()
{
	if (!isset($_POST['config']))
		return '';

	$config = $_POST['config'];
	$text_in = $_POST['text'];
	$client = $_POST['client'];
	$pricise = $_POST['pricise'];
	
	if (strlen($text_in) > 102400)
		return '';
	
	write_log($client, $config, $text_in);

	if (!$pricise)
	{
		$od = opencc_open($config);
		$text_out = opencc_convert($od, $text_in);
		opencc_close($od);
	}
	else
	{
		$text_out = convert_precise($text_in, $config);
	}
	
	return $text_out;
}

$text_out = get_and_convert();
echo $text_out;