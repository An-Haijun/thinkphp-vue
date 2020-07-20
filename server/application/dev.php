<?php

$t = time();

return [
  'app_debug' => true,
  'env' => 'development',
  'timestamp' => $t, // 引入资源时间戳，必须保留该字段
];