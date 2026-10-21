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


    /**
     * Login request to user service
     */
    public function login(array $credentials)
    {
        return $this->client()->post("{$this->baseUrl}/auth/login", $credentials);
    }


    /**
     * Registration request to user service
     */
    public function register(array $credentials)
    {
        return $this->client()->post("{$this->baseUrl}/auth/register", $credentials);
    }


    /**
     * Base method that contains necessary configuration
     */
    private function client()
    {
        return Http::baseUrl($this->baseUrl)
            ->timeout(10)
            ->acceptJson()
            ->asJson()
        ;
    }
}
