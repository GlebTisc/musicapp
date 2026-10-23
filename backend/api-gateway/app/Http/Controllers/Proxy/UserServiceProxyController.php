<?php

namespace App\Http\Controllers\Proxy;

use App\Http\Controllers\Controller;
use App\Services\Clients\UserServiceClient;
use Illuminate\Http\Client\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class UserServiceProxyController extends Controller
{
    public function __construct(private UserServiceClient $client) {}


    public function register(Request $request)
    {
        return $this->proxyResponse(
            $client->register($request->only(['email', 'username', 'password']))
        );
    }


    public function login(Request $request)
    {
        return $this->proxyResponse(
            $client->login($request->only(['username', 'password']))
        );
    }


    public function refresh(Request $request)
    {
        return $this->proxyResponse($client->refresh());
    }


    public function me(Request $request)
    {
        return $this->proxyResponse($client->me());
    }


    private function proxyResponse(Response $response): JsonResponse
    {
        $jsonResponse = response()->json(
            $response->json() ?? [],
            $response->status()
        );

        // set all Set-Cookie headers
        foreach ($response->headers()->getSetCookie() as $cookie) {
            $jsonResponse->header('Set-Cookie', (string) $cookie, false);
        }

        return $jsonResponse;
    }
}
