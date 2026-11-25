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
        return $this->proxyResponse($this->client->refresh($request->cookies->all()));
    }


    public function me(Request $request)
    {
        return $this->proxyResponse($this->client->me($request->cookies->all()));
    }


    public function logout(Request $request)
    {
        return $this->proxyResponse($this->client->logout($request->cookies->all()));
    }


    public function get(Request $request)
    {
        $queryParams = $request->only(['page', 'search']);
        return $this->proxyResponse($this->client->get($request->cookies->all(), $queryParams));
    }


    public function getOne(Request $request, string $id)
    {
        return $this->proxyResponse($this->client->getOne($request->cookies->all(), $id));
    }


    public function create(Request $request)
    {
        return $this->proxyResponse($this->client->create(
            $request->cookies->all(),
            $request->only(['username', 'email', 'password', 'role'])
        ));
    }


    public function update(Request $request, string $id)
    {
        return $this->proxyResponse($this->client->update(
            $request->cookies->all(),
            $request->only(['username', 'email', 'role']),
            $id
        ));
    }


    public function delete(Request $request, string $id)
    {
        return $this->proxyResponse($this->client->delete($request->cookies->all(), $id));
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
