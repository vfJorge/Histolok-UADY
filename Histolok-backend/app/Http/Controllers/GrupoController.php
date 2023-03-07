<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use Illuminate\Http\Request;

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $grupos = Grupos::with(['users','users:id,name'])->get();
        return $grupos;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $grupo = new Grupo();
        $grupo->name = $request->name;
        $grupo->desc= $request->desc;
        $grupo->user_id = auth()->user()->id;

        $grupo->save();

        $array = json_decode($request->users);
        $grupo->users()->attach($array);

        $group=Grupo::with(['users','users:id,name'])->find($grupo->id);
        return response($group,201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $grupos = Grupo::with('user:id,name','users:id,name')->findOrFail($request->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
     
    public function me(Request $request)
    {
        $grupos = Grupo::with('user:id,name','users:id,name')->whereRelation('users','user_id',auth()->user()->id)->get();
        return response($grupos,200);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
     
    public function owned(Request $request) 
    {
        $grupos = Grupo::with('user:id,name','users:id,name')->where('user_id',auth()->user()->id)->get();
        return response($grupos,200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */

    public function update(Request $request, $id)
    {
        $grupo = Grupo::findOrFail($id);

        $grupo->name = $request->get('name');
        $grupo->desc= $request->get('desc');

        if($request->filled('users')){
            $users = json_decode($request->users);
            if(!is_array($users)){
                return response(["message"=>"Error en los usuarios"],400);
            }
            $grupo->users()->sync($users);
        }
        $grupo->save();
        $group = Grupo::with(['users','users:id,name'])->find($id);
        return response($group,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        $grupo = Grupo::find($id);
        $grupo->delete();
    }
}
