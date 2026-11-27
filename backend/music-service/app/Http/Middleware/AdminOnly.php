<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->attributes->get('user');

        if (($user['role'] ?? null) !== 'admin') {
            throw new AccessDeniedHttpException('Admin access required');
        }

        return $next($request);
    }
}
