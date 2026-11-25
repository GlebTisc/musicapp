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
    Route::get('/', [UserServiceProxyController::class, 'get']);
    Route::get('/getOne/{id}', [UserServiceProxyController::class, 'getOne'])
        ->where('id', '[a-zA-Z0-9_]{1,64}');
    Route::post('/create', [UserServiceProxyController::class, 'create']);
    Route::patch('/update/{id}', [UserServiceProxyController::class, 'update'])
        ->where('id', '[a-zA-Z0-9_]{1,64}');
    Route::delete('/{id}', [UserServiceProxyController::class, 'delete'])
        ->where('id', '[a-zA-Z0-9_]{1,64}');
});
