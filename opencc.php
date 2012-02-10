<?php
function write_log($client, $config, $text_in)
{
	$file_name = time() . '_' . $client . '.log';
	$text = 'Config: ' . $config . "\n" . "\n" . $text_in;
	$path = './log/' . $file_name;
	file_put_contents($path, $text);
}

function get_and_convert()
{
	if (!isset($_POST['config']))
		return '';

	$config = $_POST['config'];
	$text_in = $_POST['text'];
	$client = $_POST['client'];
	
	if (strlen($text_in) > 102400)
		return '';
	
	write_log($client, $config, $text_in);
	
	$od = opencc_open($config);
	$text_out = opencc_convert($od, $text_in);
	opencc_close($od);

	return $text_out;
}

$text_out = get_and_convert();
echo $text_out;