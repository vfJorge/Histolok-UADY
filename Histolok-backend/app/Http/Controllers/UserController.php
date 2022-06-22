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

        if(Gate::allows('crudAll-users') || $user->type!="A"){
            return $user;
        }
        else{
            return request(['message'=>'Unauthorized acction'],403);
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
}
