<?php

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
//Public routes




//Authorized routes
Route::group([
    'middleware' => 'auth:sanctum'
], function () {
    Route::get('grupos', 'App\Http\Controllers\GrupoController@index');
    Route::post('fotos', 'App\Http\Controllers\FotoController@store');
    
});

//Auth
Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('register','App\Http\Controllers\AuthController@register');
    Route::post('login', 'App\Http\Controllers\AuthController@login');
    Route::post('logout','App\Http\Controllers\AuthController@logout');
    Route::post('refresh', 'App\Http\Controllers\AuthController@refresh');
    Route::get('me', 'App\Http\Controllers\AuthController@me');
    Route::get('type', 'App\Http\Controllers\AuthController@type');
    
});