<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsPresent
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // check if token is provided
        if (!$request->bearerToken()) {
            return response()->json([
                "error" => "Unauthenticated",
                "message" => "Authorization token is required"
            ], 401);
        }

        return $next($request);
    }
}
