<?php

namespace App\Http\Controllers;
use App\Models\Examen;
use App\Models\Pregunta;
use App\Models\Opcion;
use App\Models\Palabclv;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class ExamenController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $examen = Examen::with(['palabclvs','user:id,name'])->get();
        return $examen;
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function public()
    {
        $examen = Examen::with(['palabclvs','user:id,name'])->where('access','public')->get();
        return $examen;
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
            'title'=> 'required|string',
            'description'=>'required|string',
            'n_questions'=>'integer',
            'difficulty'=>'required|integer|between:1,5',
            'duration'=>'required',
            'access'=>['required',Rule::in(['private','public'])]
            
        ]);


        $examen = new Examen();
        $examen->title = $request->title;
        $examen->description = $request->description;
        $examen->user_id = auth()->user()->id;
        $examen->difficulty = $request->difficulty;
        $examen->access = $request->access;
        $examen->duration = $request->duration;
        $examen->n_questions=0;
        $examen->n_correct=0;
        $examen->mode="batalla"; 
        
        $examen->save();

        //palabras clave
        $array = json_decode($request->keywords);
                                                        //$array =array_filter(preg_split("/^\[|\]$|,|'+/", $request->keywords)); si es con ' en vez de "
        if(!is_array($array)){
            $examen->delete();
            return response(["message"=>"Error en las palabras clave"],400);
        } 
        foreach($array as $keyword){
            $palabraclv = Palabclv::firstOrCreate(['keyword'=>mb_strtolower($keyword)]);
            $examen->palabclvs()->attach($palabraclv);
        }
        //preguntas
        if($examen->mode=="batalla"){
            $preguntas_arr = json_decode($request->questions);
            if(!is_array($preguntas_arr)){
                $examen->palabclvs()->detach();
                $examen->delete();
                return response(["message"=>"Error al agregar las preguntas"],400);
            } 
            $npreguntas=0;
            foreach($preguntas_arr as $preguntaid){
                $pregunta = Pregunta::findOrFail($preguntaid);
                if($pregunta->access=="public"){
                    $examen->preguntas()->attach($pregunta);
                    $npreguntas++;
                }
                
            }
            $examen->n_questions=$npreguntas;
        }
        
            
        $examen->push();
        $examen=Examen::with(['palabclvs','user:id,name',"preguntas:id,question"])->findOrFail($examen->id);
        return response($examen,201);
    }

    public function generarExamen(Request $request)
    {
        $request->validate([
            'title'=> 'required|string',
            'n_questions'=>'required|integer',
            'difficulty'=>'required|integer|between:1,5',
            'duration'=>'required'
            
        ]);

        $examen = new Examen();
        $examen->title = $request->title;
        $examen->user_id = auth()->user()->id;
        $examen->difficulty = $request->difficulty;
        $examen->access = "private";
        $examen->duration = $request->duration;
        $examen->n_questions=$request->n_questions;
        $examen->n_correct=0;
        $examen->mode="entrenamiento";
        $examen->description = "Examen de practica ".(Examen::where('user_id',auth()->user()->id)->where('mode','entrenamiento')->count()+1)." Dificultad ".$request->difficulty;
        
        $examen->save();

        //palabras clave
        $array = json_decode($request->keywords);
        //$array =array_filter(preg_split("/^\[|\]$|,|'+/", $request->keywords)); si es con ' en vez de "
        if(!is_array($array)){
            $examen->delete();
            return response(["message"=>"Error en las palabras clave"],400);
            } 
            foreach($array as $keyword){
            $palabraclv = Palabclv::firstOrCreate(['keyword'=>mb_strtolower($keyword)]);
            $examen->palabclvs()->attach($palabraclv);
        }

        if(is_array($array) && count($array)>0){
            $preguntas = Pregunta::where('access','public')->where('difficulty', $request->difficulty)->whereHas('palabclvs',function ($query) use ($array) {
            
                $query->whereIn('keyword', $array);
                             
            })
            ->select('id')->inRandomOrder()->limit($request->n_questions)->get();
        }
        else{
            $preguntas = Pregunta::where('access','public')->where('difficulty', $request->difficulty)->inRandomOrder()->limit($request->n_questions)->get();
        }
        $examen->preguntas()->attach($preguntas);

        $examen->push();
        $examen=Examen::with(['palabclvs','user:id,name',"preguntas:id,question"])->findOrFail($examen->id);
        return response($examen,201);
    }



    public function show(Request $request)
    {
        $examen = Examen::with(['palabclvs','user:id,name','preguntas:id,title,question','preguntas.opcions'])->findOrFail($request->id);
        if($examen->access!="public" && auth()->user()->id!=$examen->user_id) return response(['message'=>'Este examen es privado'],403);
        return response($examen,200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $examen = Examen::findOrFail($request->id);

        Gate::authorize('author-examen', $examen);
        Gate::authorize('batalla-examen', $examen);

        $request->validate([
            'title'=> 'required|string',
            'description'=>'required|string',
            'difficulty'=>'required|integer|between:1,5',
            'duration'=>'required',
            'access'=>['required',Rule::in(['private','public'])]
            
        ]);
        if($request->filled('title')) $examen->title = $request->title;
        if($request->filled('description')) $examen->description = $request->description;
        if($request->filled('difficulty')) $examen->difficulty = $request->difficulty;
        if($request->filled('duration')) $examen->duration = $request->duration;
        if($request->filled('access')) $examen->access = $request->access;

        $examen->save();
        //palabras clave
        if($request->filled('keywords')){
            $keywords = json_decode($request->keywords);
            if(!is_array($keywords)){
                return response(["message"=>"Error en las palabras clave"],400);
            }
            $array = array();
            foreach($keywords as $keyword){
                $palabraclv = Palabclv::firstOrCreate(['keyword'=>mb_strtolower($keyword)]);
                array_push($array,$palabraclv->id);
            }
            $examen->palabclvs()->sync($array);
        }


        //preguntas
        if($request->filled('questions')){
            $preguntas_arr = json_decode($request->questions);
            if(!is_array($preguntas_arr)){
                return response(["message"=>"Error al cambiar las preguntas"],400);
            } 
            $examen->preguntas()->detach();
            $npreguntas=0;
            foreach($preguntas_arr as $preguntaid){
                $pregunta = Pregunta::findOrFail($preguntaid);
                if($pregunta->access=="public"){
                    $examen->preguntas()->attach($pregunta);
                    $npreguntas++;
                }
                
            }
            $examen->n_questions=$npreguntas;
        }
        
            
        $examen->push();
        $examen=Examen::with(['palabclvs','user:id,name',"preguntas:id,question"])->findOrFail($examen->id);
        return response($examen,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Pregunta  $pregunta
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $examen = Examen::findOrFail($request->id);
        Gate::authorize('author-examen', $examen);

        $examen->palabclvs()->detach();
        $examen->preguntas()->detach();
        $examen->delete();
    }
}
