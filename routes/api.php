<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes pour gérer les rôles et utilisateurs
Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles/create', [RoleController::class, 'store']);
Route::get('/users', [UserController::class, 'index']);
Route::post('/users/create', [UserController::class, 'store']);
Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole']);
Route::post('/users/{user}/revoke-role', [UserController::class, 'revokeRole']);
