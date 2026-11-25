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
    Route::post('/logout', [UserServiceProxyController::class, 'logout']);
    Route::get('/getList', [UserServiceProxyController::class, 'getList']);
    Route::get('/{id}', [UserServiceProxyController::class, 'get'])
        ->where('id', '[a-zA-Z0-9_]{1,64}');
});
