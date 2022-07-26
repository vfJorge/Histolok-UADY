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
    public function show(Grupo $grupo)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function me(Request $request)
    {
        $grupos = Grupo::with('users','users:id')->where('user_id',auth()->user()->id)->get();

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
        $grupo = Grupo::find($id);

        $grupo->name = $request->get('name');
        $grupo->description= $request->get('description');
        $grupo->creator=1;
        $grupo->update_at;
        $grupo->create_at;

        $grupo->save();

        return redirect('/grupos');
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
        return redirect('/grupos');
    }
}
