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

//Public routes (Auth)
Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('register','App\Http\Controllers\AuthController@register');
    Route::post('login', 'App\Http\Controllers\AuthController@login');
});

//Authenticated routes
Route::group([
    'middleware' => 'auth:sanctum'
], function () {

    Route::group([
        'prefix' => 'users'
    ], function () {
        Route::get('','App\Http\Controllers\UserController@index');         //ver todos los usuarios
        Route::get('me', 'App\Http\Controllers\UserController@me');         //ver mi perfil
        Route::get('{id}', 'App\Http\Controllers\UserController@show');     //ver otro perfil
        Route::put('{id}', 'App\Http\Controllers\UserController@update');   //actualizar la info de mi perfil o si soy admin la de cualquiera
        Route::delete('{id}', 'App\Http\Controllers\UserController@destroy')->middleware('is_superuser');//borrar perfil de estudiante (solo admins y profesores)
    });

    Route::group([
        'prefix' => 'grupos',
        'middleware'=>'is_superuser'
    ], function () {
        Route::get('', 'App\Http\Controllers\GrupoController@index')->middleware('is_admin');//ver todos los grupos (solo admin)
        Route::get('me', 'App\Http\Controllers\GrupoController@me');                         //ver los grupos a los que pertenezco 
        Route::post('', 'App\Http\Controllers\GrupoController@store');                       //crear nuevo grupo   
        Route::get('{id}', 'App\Http\Controllers\GrupoController@show');                     //ver informacion de un grupo   
        Route::put('{id}', 'App\Http\Controllers\GrupoController@update');                   //actualizar info e integrantes de grupo   
        Route::delete('{id}', 'App\Http\Controllers\GrupoController@destroy');               //borrar grupo
    });

    Route::group([
        'prefix' => 'fotos',
        'middleware'=>'is_superuser'
    ], function () {
        Route::get('', 'App\Http\Controllers\FotoController@index')->middleware('is_admin');            //ver todas las fotos
        Route::get('public','App\Http\Controllers\FotoController@public');  //ver las preguntas publicas
        Route::get('me', 'App\Http\Controllers\FotoController@owned');          //ver mis fotos
        Route::post('', 'App\Http\Controllers\FotoController@store');           //crear nueva foto
        Route::get('{id}', 'App\Http\Controllers\FotoController@show');         //ver una foto e info
        Route::put('{id}', 'App\Http\Controllers\FotoController@update');       //cambiar una foto (solo mias)
        Route::delete('{id}', 'App\Http\Controllers\FotoController@destroy');   //borrar una foto (solo mias)
    });
    
    Route::group([
        'prefix' => 'preguntas',
        'middleware'=>'is_superuser'
    ], function () {
        Route::get('','App\Http\Controllers\PreguntaController@index')->middleware('is_admin');//ver todas las preguntas
        Route::get('public','App\Http\Controllers\PreguntaController@public');  //ver las preguntas publicas
        Route::get('me', 'App\Http\Controllers\PreguntaController@owned');         //ver mis preguntas
        Route::get('{id}', 'App\Http\Controllers\PreguntaController@show');     //ver una pregunta
        Route::post('', 'App\Http\Controllers\PreguntaController@store');          //crear pregunta
        Route::put('{id}', 'App\Http\Controllers\PreguntaController@update');   //actualizar la info de pregunta
        Route::delete('{id}', 'App\Http\Controllers\PreguntaController@destroy');//borrar una pregunta
    });

    Route::group([
        'prefix' => 'examenes',
        'middleware'=>'is_superuser'
    ], function () {
        Route::get('','App\Http\Controllers\ExamenController@index')->middleware('is_admin');//ver todas los examenes
        Route::get('public','App\Http\Controllers\ExamenController@public');  //ver los examenes publicas
        Route::get('me', 'App\Http\Controllers\ExamenController@owned');         //ver mis examenes
        Route::post('', 'App\Http\Controllers\ExamenController@store');          //crear examen
        Route::get('{id}', 'App\Http\Controllers\ExamenController@show');     //ver un examen
        Route::put('{id}', 'App\Http\Controllers\ExamenController@update');   //editar examen
        Route::delete('{id}', 'App\Http\Controllers\ExamenController@destroy');//borrar un examen
    });

    Route::group([
        'prefix' => 'examenes'
    ], function () {
        Route::post('generate', 'App\Http\Controllers\ExamenController@generarExamen');          //generar examen
    });
    //Auth
    Route::post('logout','App\Http\Controllers\AuthController@logout');
    Route::get('type', 'App\Http\Controllers\AuthController@type');
   
});
