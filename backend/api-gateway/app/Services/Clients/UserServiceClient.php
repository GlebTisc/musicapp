<?php

namespace App\Services\Clients;

use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\Cookie\SetCookie;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
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
        return $this->client()->post("/auth/login", $credentials);
    }


    /**
     * Registration request to user service
     */
    public function register(array $credentials)
    {
        return $this->client()->post("/auth/register", $credentials);
    }


    /**
     * Refresh JWT token
     */
    public function refresh(array $cookies = []): Response
    {
        return $this->withCookies($this->client(), $cookies)
            ->post('/auth/refresh');
    }


    /**
     * Get user info
     */
    public function me(array $cookies = []): Response
    {
        return $this->withCookies($this->client(), $cookies)
            ->get('/user/me');
    }


    /**
     * Logout user
     */
    public function logout(array $cookies = []): Response
    {
        return $this->withCookies($this->client(), $cookies)
            ->post('/user/logout');
    }


    public function getAll(string $queryParams): Response
    {
        return $this->client()->get('/user/getAll', $queryParams);
    }


    /**
     * Base method that contains necessary configuration
     */
    private function client(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->timeout(10)
            ->acceptJson()
            ->asJson()
        ;
    }

    /**
     * Add cookies to the request
     */
    private function withCookies(PendingRequest $request, array $cookies): PendingRequest
    {
        if (empty($cookies)) {
            return $request;
        }

        $host = parse_url($this->baseUrl, PHP_URL_HOST);

        $jar = new CookieJar();
        foreach ($cookies as $name => $value) {
            $jar->setCookie(new SetCookie([
                'Name'   => $name,
                'Value'  => $value,
                'Domain' => $host,
                'Path'   => '/',
            ]));
        }

        return $request->withOptions(['cookies' => $jar]);
    }
}
