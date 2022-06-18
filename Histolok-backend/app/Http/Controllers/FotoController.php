<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Foto;
use App\Models\Palabclv;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class FotoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $fotos = Foto::all();
        return $fotos;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $request->validate([
            'title'=>'required|string',
            'desc'=>'required|string'
        ]);


        $foto = new Foto();
        $foto->title = $request->title;
        $foto->desc = $request->desc;
        $foto->user_id = auth()->user()->id;

        if(!$request->hasfile('image')){
            return response()->json(['error'=>"file 'image' not given"],400);
        }
        $extension = $request->file('image')->extension();

        if(!$extension=='jpg'){
            return response()->json(['errors'=>'image is not in jpg format'],400);
        }
        $foto->filename = $request->file('image')->store('imagenes');
        $foto->originalName = $request->file('image')->getClientOriginalName();
        $foto->format = $extension;
        $foto->save();
        
        //refactorear en otra funcion XD
        $array = json_decode($request->keywords);
                                                        //$array =array_filter(preg_split("/^\[|\]$|,|'+/", $request->keywords)); si es con ' en vez de "
        foreach($array as $keyword){
            $palabraclv = Palabclv::firstOrCreate(['keyword'=>mb_strtolower($keyword)]);
            $foto->palabclvs()->attach($palabraclv);
        }

        $photo=Foto::with('palabclvs')->find($foto->id);
        //print_r($photo);
        return response($photo,201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $foto = Foto::with('palabclvs')->findOrFail($request->id);

        return response($foto,200);
    }

    /**
     * Display the specified image.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function image(Request $request)
    {
        $foto = Foto::findOrFail($request->id);
        //cambiar a la direccion
        $path = "D:/Users/rodri/OneDrive - Universidad Autonoma de Yucatan/UNIVERSIDAD/Practicas/Histolok-UADY/Histolok-backend/storage/app/";
        return response()->file($path.$foto->filename,['Content-type'=>'image/jpg']);
    }    

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function edit(Grupo $grupo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Grupo $grupo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Grupo $grupo)
    {
        //
    }
}
