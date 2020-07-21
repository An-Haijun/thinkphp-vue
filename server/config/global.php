<?php

$env = 'prod'; // Build 自动生成 dev | prod

$t = time();

if ($env === 'prod') {
  $t = '1595296953026'; // Build 自动生成时间戳
}

return [
  'app_status'       => $env,
  'timestamp'       => $t
];