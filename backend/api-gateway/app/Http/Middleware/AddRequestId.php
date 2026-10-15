<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AddRequestId
{
    /**
     * Add X-Request-ID header for tracing purposes
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = $request->header('X-Request-ID') ?: (string) Str::uuid();

        // add request id for the incoming request
        $request->headers->set('X-Request-ID', $requestId);

        $response = $next($request);

        // add request id for the outgoing response
        $response->header('X-Request-ID', $requestId);

        return $response;
    }
}
