<?php

namespace App\Services\Clients;

use Illuminate\Support\Facades\Http;

class UserServiceClient
{
    private string $baseUrl;


    public function __construct()
    {
        $this->baseUrl = config('microservices.user_service.url');
    }


    public function login(array $credentials)
    {
        return Http::timeout(10)->post("{$this->baseUrl}/auth/login");
    }


    public function register(array $credentials)
    {
        return Http::timeout(10)->post("{$this->baseUrl}/auth/register");
    }
}
