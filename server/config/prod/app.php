<?php

$prod = [
  'app_debug'       => false,
  'app_env'         => 'production',
];

$envConf = include 'timestamp.php';

$prod = array_merge($prod, $envConf);

return $prod;