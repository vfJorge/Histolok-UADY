<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {   
        Gate::allows('crudAll-users')
            ? $users = User::all()
            : $users = User::where('type','E')->orWhere('type','S')->get();
        return $users;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $user = User::findOrFail($request->id);

        if($user->type!="E"){
            return $user;
        }
        else{
            return response(['message'=>'Unauthorized acction'],403);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function me()
    {
        $user = User::where('id',auth()->user()->id)->first();
        return response($user,200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $request->validate([
            'name'=>'string',
            'type'=>Rule::in(['A','S','E']),
        ]);

        $user= User::findOrFail($request->id);

        if(Gate::allows('author-users',$user)||Gate::allows('crudAll-users')){
            if($request->has('name')) $user->name = $request->name;
            if($request->has('type') && Gate::allows('crudAll-users')) $user->type = $request->type;
            $user->save();
            return $user;
        }
        else return request(['message'=>'Unauthorized acction'],403);
                                                                //Checar pq no tira la excepcion
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $user= User::findOrFail($request->id);
        Gate::authorize('delete-user',$user);
        $user->grupos()->detach();
        $user->delete();
    }

    public function results(Request $request)
    {
        $user = User::with(['examenes:title,n_questions'])->findOrFail($request->id);
        $arr=array();

        
        foreach ($user->examenes as $examen) {
            $pivot=$examen->pivot;
            $n_preguntas=$examen->n_questions;
            $contestadas = $pivot->n_answered;
            $correctas  = $pivot->n_correct;
            $calif=$correctas*100/$n_preguntas;
            $completado = $n_preguntas==$contestadas ? true : false;
            if($completado) $duration = strtotime($pivot->end_time) - strtotime($pivot->start_time);
            else $duration = 0;
            
            $arry=[
            'titulo'=>$examen->title,
            'completado'=>$completado,
            'calificacion'=>$calif,
            'correctas'=>$correctas,
            'n_preguntas'=>$n_preguntas,
            'duracion'=>date('H:i:s',$duration),
            'fecha'=>date('d-m-Y',strtotime($pivot->start_time))
            ];
            
            array_push($arr,$arry);
        }
        $reversed = array_reverse($arr);
        return response(["resultados"=>$reversed],200);
    }
}
