<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRequestsJson
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // check if request has JSON format
        if (!$request->wantsJson()) {
            return response()->json([
                "error" => "NotAcceptable",
                "message" => "Only JSON responses are allowed"
            ], Response::HTTP_NOT_ACCEPTABLE);
        }

        // check if request has JSON format
        if (!$request->isMethod('GET') && !$request->isJson()) {
            return response()->json([
                "error" => "UnsupportedMediaType",
                "message" => "Only JSON requests are allowed"
            ], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }

        return $next($request);
    }
}
