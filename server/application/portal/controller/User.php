<?php

namespace app\portal\controller;

use app\common\controller\Base;

class User extends Base
{
    public function login()
    {
        return $this->fetch('user/login');
    }
}
