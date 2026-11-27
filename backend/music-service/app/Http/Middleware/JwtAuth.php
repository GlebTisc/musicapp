<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class JwtAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie(config('jwt.cookie_name'))
            ?? $request->bearerToken();

        // check if token exists
        if (!$token) {
            throw new UnauthorizedHttpException('Bearer', 'You are not logged in');
        }

        // verify the token
        try {
            $key = file_get_contents(config('jwt.public_key_path'));
            $payload = JWT::decode($token, new Key($key, config('jwt.algo')));
        } catch (ExpiredException) {
            throw new UnauthorizedHttpException('Bearer', 'Session expired');
        } catch (\Throwable) {
            throw new UnauthorizedHttpException('Bearer', 'Invalid token');
        }

        $request->attributes->set('user', [
            'id' => $payload->id ?? null,
            'role' => $payload->role ?? null,
        ]);

        return $next($request);
    }
}
