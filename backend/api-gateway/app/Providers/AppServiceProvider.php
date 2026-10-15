<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // limitation for unauthorized users
        RateLimiter::for("global", fn(Request $request) => Limit::perMinute(100)->by($request->ip()));

        // limitation for the api
        RateLimiter::for("api", function (Request $request) {
            return $request->user()
                ? Limit::perMinute(1000)->by($request->user()->id)
                : Limit::perMinute(100)->by($request->ip());
        });

        // limitation for strict routes (registration, login, etc.)
        RateLimiter::for("strict", fn(Request $request) => Limit::perMinute(20)->by($request->ip())->response(
            function () {
                return response()->json([
                    "error" => "Too many requests",
                    "message" => "Try again later"
                ], 429);
            }
        ));

        Http::globalRequestMiddleware(function ($request) {
            // add tracing
            $requestId = Request::header("X-Request-ID");

            // check if request id is provided
            if ($requestId) {
                $request = $request->withHeader('X-Request-ID', $requestId);
            }

            return $request;
        });
    }
}
