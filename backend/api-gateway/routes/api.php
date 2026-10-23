<?php

use App\Http\Controllers\Proxy\UserServiceProxyController;
use Illuminate\Support\Facades\Route;

Route::prefix('/auth')->group(function () {
    Route::post('/register', [UserServiceProxyController::class, 'register']);
    Route::post('/login', [UserServiceProxyController::class, 'login']);
    Route::post('/refresh', [UserServiceProxyController::class, 'refresh']);
});

Route::prefix('/user')->group(function () {
    Route::get('/me', [UserServiceProxyController::class, 'me']);
});
