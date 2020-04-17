<?php

$copyrightInfo = '/*
 * Crypto-JS v2.5.2
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2011 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
';

$files = array('crypto', 'md5', 'sha1', 'sha256', 'hmac', 'pbkdf2', 'pbkdf2async',
               'marc4', 'rabbit', 'aes', 'des', 'blockmodes');
$rollups = array(
	array('crypto', 'md5'),
	array('crypto', 'sha1'),
	array('crypto', 'sha256'),
	array('crypto', 'md5', 'hmac'),
	array('crypto', 'sha1', 'hmac'),
	array('crypto', 'sha256', 'hmac'),
	array('crypto', 'sha1', 'hmac', 'pbkdf2'),
	array('crypto', 'sha1', 'hmac', 'pbkdf2async'),
	array('crypto', 'sha1', 'hmac', 'pbkdf2', 'marc4'),
	array('crypto', 'sha1', 'hmac', 'pbkdf2', 'rabbit'),
	array('crypto', 'sha1', 'hmac', 'pbkdf2', 'blockmodes', 'aes'),
	array('crypto', 'sha1', 'hmac', 'pbkdf2', 'blockmodes', 'des')
);

foreach ($files as $file) {
	mkdir("../build/$file");
	$js = file_get_contents("../src/$file.js");
	file_put_contents("../build/$file/$file.js", $copyrightInfo . $js);
	file_put_contents("../build/$file/$file-min.js", $copyrightInfo . compress($js));
}

foreach ($rollups as $rollup) {
	$rollupName = implode("-", $rollup);
	mkdir("../build/$rollupName");
	$js = '';
	foreach ($rollup as $file) $js .= file_get_contents("../src/$file.js");
	file_put_contents("../build/$rollupName/$rollupName.js", $copyrightInfo . compress($js));
}

function compress($js) {

	$cmd = 'java -jar compiler/compiler.jar';

	$descriptors = array(
		0 => array('pipe', 'r'),
		1 => array('pipe', 'w'),
		2 => array('pipe', 'w')
	);

	$process = proc_open($cmd, $descriptors, $pipes);
	if ($process === false) die();

	fwrite($pipes[0], $js);
	fclose($pipes[0]);

	$compressed = stream_get_contents($pipes[1]);
	fclose($pipes[1]);

	$errors = stream_get_contents($pipes[2]);
	fclose($pipes[2]);

	$exitStatus = proc_close($process);

	if ($exitStatus != 0 or $errors != '') die();

	return $compressed;

}
