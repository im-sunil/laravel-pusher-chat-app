<?php

use App\Support\AuthUser;

if (!function_exists('user')) {
    /**
     * Get the available auth instance.
     */

    function user()
    {
        return (new AuthUser)();
    }
}
