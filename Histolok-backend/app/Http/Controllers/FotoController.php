<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FotoController extends Controller
{
    public function index()
    {
        $fotos = Foto::all();
        return $fotos;
    }

    public function store(Request $request)
    {
        $foto = new Foto();
        $foto->title = $request->title;
        $foto->photo = $request->photo;
        $foto->keywords = $request->keywords;
        $foto->desc = $request->desc;
        $foto->user_id = $request->stockQty;

        $foto->save();
    }
}
