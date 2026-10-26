<?php

namespace App\Http\Controllers\Proxy;

use App\Http\Controllers\Controller;
use App\Services\Clients\UserServiceClient;
use Illuminate\Http\Request;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;

class UserServiceProxyController extends Controller
{
    public function __construct(private UserServiceClient $client) {}


    public function register(Request $request)
    {
        return $this->proxyResponse(
            $this->client->register($request->only(['email', 'username', 'password']))
        );
    }


    public function login(Request $request)
    {
        return $this->proxyResponse(
            $this->client->login($request->only(['username', 'password']))
        );
    }


    public function refresh(Request $request)
    {
        return $this->proxyResponse($this->client->refresh());
    }


    public function me(Request $request)
    {
        return $this->proxyResponse($this->client->me());
    }


    private function proxyResponse(Response $response): JsonResponse
    {
        $jsonResponse = response()->json(
            $response->json() ?? [],
            $response->status()
        );

        // set all Set-Cookie headers
        foreach ($response->toPsrResponse()->getHeader('Set-Cookie') as $cookie) {
            $jsonResponse->headers->set('Set-Cookie', (string) $cookie, false);
        }

        return $jsonResponse;
    }
}
