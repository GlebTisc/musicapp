<?php

use App\Http\Middleware\AddRequestId;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        // api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // tracing middleware
        $middleware->append(AddRequestId::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->stopIgnoring(HttpException::class);

        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*'),
        );

        // if microservice isn't accessible
        $exceptions->render(fn(ConnectionException $e, Request $request) => response()->json([
            "error" => "Service temporarily unavailable",
            "message" => "Please try again later"
        ], 503));

        // if microservice returned HTTP exception
        $exceptions->render(fn(RequestException $e, Request $request) => response()->json([
            "error" => $e->response->json('error') ?? "Service error",
            "message" => $e->response->json('message') ?? "An error occurred"
        ], $e->response->status()));
    })->create();
