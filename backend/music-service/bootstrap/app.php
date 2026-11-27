<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php'
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \App\Http\Middleware\ForceJson::class,
        ]);

        $middleware->alias([
            'jwt'   => \App\Http\Middleware\JwtAuth::class,
            'admin' => \App\Http\Middleware\AdminOnly::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 422 - validation error
        $exceptions->render(function (ValidationException $e, $request) {
            $details = collect($e->errors())
                ->flatMap(
                    fn($messages, $field) =>
                    collect($messages)->map(fn($m) => ['field' => $field, 'message' => $m])
                )
                ->values();

            return response()->json([
                'error'   => 'ValidationError',
                'message' => 'The given data was invalid',
                'status'  => 422,
                'details' => $details,
            ], 422);
        });

        // 401 - authentication errors
        $exceptions->render(function (UnauthorizedHttpException $e, $request) {
            return response()->json([
                'error'   => 'AuthenticationError',
                'message' => $e->getMessage() ?: 'Unauthenticated',
                'status'  => 401,
            ], 401);
        });

        // 403 - authorization errors
        $exceptions->render(function (AccessDeniedHttpException $e, $request) {
            return response()->json([
                'error'   => 'ForbiddenError',
                'message' => $e->getMessage() ?: 'Forbidden',
                'status'  => 403,
            ], 403);
        });

        // 404
        $exceptions->render(function (ModelNotFoundException $e, $request) {
            return response()->json([
                'error'   => 'NotFoundError',
                'message' => 'Resource not found',
                'status'  => 404,
            ], 404);
        });

        // unknown exceptions
        $exceptions->render(function (\Throwable $e, $request) {
            if ($e instanceof HttpExceptionInterface) {
                return response()->json([
                    'error'   => class_basename($e),
                    'message' => $e->getMessage(),
                    'status'  => $e->getStatusCode(),
                ], $e->getStatusCode());
            }

            return response()->json([
                'error'   => 'InternalError',
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong',
                'status'  => 500,
            ], 500);
        });
    })->create();
