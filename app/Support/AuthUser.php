<?php

namespace App\Support;

use Illuminate\Support\Facades\Auth;

class AuthUser
{
    public function __invoke()
    {

        return (
            request()->has('api_token') ?
            Auth::guard("api")->user() : Auth::user()
        );
    }

}
