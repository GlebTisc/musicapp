<?php

namespace App\Http\Controllers\Proxy;

use App\Http\Controllers\Controller;
use App\Services\Clients\UserServiceClient;
use Illuminate\Http\Client\Request;

class UserServiceProxyController extends Controller
{
    public function __construct(private UserServiceClient $client) {}


    public function register(Request $request)
    {
        // implementation ...
    }
}
