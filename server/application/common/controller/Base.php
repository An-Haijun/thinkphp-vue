<?php

namespace app\common\controller;

use think\Controller;

class Base extends Controller
{
  public function _initialize()
  {
    parent::_initialize();
    $this->assignRouter();
  }

  public function assignRouter()
  {
    $t = time();
    $this->assign('t', $t);
  }
}
