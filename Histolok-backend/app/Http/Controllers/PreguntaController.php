<?php

namespace App\Http\Controllers;

use App\Models\Pregunta;
use App\Models\Opcion;
use App\Models\Palabclv;
use App\Models\Foto;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class PreguntaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $preguntas = Pregunta::with(['palabclvs','user:id,name','opcions:id,opcion'])->get();
        return $preguntas;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function public()
    {
        $preguntas = Pregunta::with(['palabclvs','user:id,name','opcions:id,opcion'])->where('access','public')->get();
        return $preguntas;
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
            'question'=>'required|string',
            'answer'=>'required|string',
            'option1'=>'required|string',
            'option2'=>'string|nullable',
            'option3'=>'string|nullable',
            'option4'=>'string|nullable',
            'foto_id'=>'integer|required',
            'difficulty'=>'required|integer|between:1,5',
            'access'=>['required',Rule::in(['private','public'])]
        ]);


        $pregunta = new Pregunta();
        $pregunta->title = $request->title;
        $pregunta->question = $request->question;
        $pregunta->user_id = auth()->user()->id;
        $foto = Foto::findOrFail($request->foto_id);
        if($foto->access=="private"){
            return response(["message"=>"La imagen es privada"],400);
        }
        $pregunta->foto_id = $foto->id;
        $pregunta->difficulty = $request->difficulty;
        $pregunta->access = $request->access;
        $nopciones = 2;

        $respuesta = Opcion::firstOrCreate(['opcion'=>$request->answer]);
        $pregunta->answer_id = $respuesta->id;
        
        $pregunta->save();

        //refactorear en otra funcion XD
        $pregunta->opcions()->attach($respuesta);
        $opcion1 = Opcion::firstOrCreate(['opcion'=>$request->option1]);
        $pregunta->opcions()->attach($opcion1);
        if($request->filled('option2')){
            $opcion2 = Opcion::firstOrCreate(['opcion'=>$request->option2]);
            $pregunta->opcions()->attach($opcion2);
            $nopciones++;
        }
        if($request->filled('option3')){
            $opcion3 = Opcion::firstOrCreate(['opcion'=>$request->option3]);
            $pregunta->opcions()->attach($opcion3);
            $nopciones++;
        }
        if($request->filled('option4')){
            $opcion4 = Opcion::firstOrCreate(['opcion'=>$request->option4]);
            $pregunta->opcions()->attach($opcion4);
            $nopciones++;
        }
         $pregunta->n_opcions = $nopciones;
         $pregunta->save();
        //refactorear en otra funcion XD
        $array = json_decode($request->keywords);
                                                        //$array =array_filter(preg_split("/^\[|\]$|,|'+/", $request->keywords)); si es con ' en vez de "
        if(!is_array($array)){
            $pregunta->delete();
            return response(["message"=>"Error en las palabras clave"],400);
        } 
        foreach($array as $keyword){
            $palabraclv = Palabclv::firstOrCreate(['keyword'=>mb_strtolower($keyword)]);
            $pregunta->palabclvs()->attach($palabraclv);
        }

        $pregunta=Pregunta::with(['palabclvs','user:id,name','opcions:id,opcion'])->find($pregunta->id);
        return response($pregunta,201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Pregunta  $pregunta
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $pregunta = Pregunta::with(['palabclvs','user:id,name','opcions:id,opcion'])->findOrFail($request->id);
        if($pregunta->access!="public" && auth()->user()->id!=$pregunta->user_id) return response(['message'=>'Esta pregunta es privada'],403);
        return response($pregunta,200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Grupo  $grupo
     * @return \Illuminate\Http\Response
     */
    public function owned(Request $request)
    {
        $preguntas = Pregunta::with(['palabclvs','opcions:id,opcion','user:id,name'])->where('user_id',auth()->user()->id)->get();

        return response($preguntas,200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pregunta  $pregunta
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $pregunta = Pregunta::with(['palabclvs','opcions:id,opcion'])->findOrFail($request->id);

        Gate::authorize('author-pregunta', $pregunta);

        $request->validate([
            'title'=> 'required|string',
            'question'=>'required|string',
            'answer'=>'required|string',
            'option1'=>'required|string',
            'option2'=>'string|nullable',
            'option3'=>'string|nullable',
            'option4'=>'string|nullable',
            'difficulty'=>'required|integer|between:1,5',
            'access'=>['required',Rule::in(['private','public'])]
        ]);
        if($request->filled('title')) $pregunta->title = $request->title;
        if($request->filled('question')) $pregunta->question = $request->question;
        $opciones = array();
        if($request->filled('answer')){
            $respuesta = Opcion::firstOrCreate(['opcion'=>$request->answer]);
            $pregunta->answer_id=$respuesta->id;
            array_push($opciones,$respuesta->id);
        }
        if($request->filled('option1')){
            $opcion1 = Opcion::firstOrCreate(['opcion'=>$request->option1]);
            array_push($opciones,$opcion1->id);
        }
        if($request->filled('option2')){
            $opcion2 = Opcion::firstOrCreate(['opcion'=>$request->option2]);
            array_push($opciones,$opcion2->id);
        }
        if($request->filled('option3')){
            $opcion3 = Opcion::firstOrCreate(['opcion'=>$request->option3]);
            array_push($opciones,$opcion3->id);
        }
        if($request->filled('option4')){
            $opcion4 = Opcion::firstOrCreate(['opcion'=>$request->option4]);
            array_push($opciones,$opcion4->id);
        }
        $pregunta->opcions()->sync($opciones);
        
        if($request->filled('difficulty')) $pregunta->difficulty = $request->difficulty;
        if($request->filled('access')) $pregunta->access = $request->access;

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
            $pregunta->palabclvs()->sync($array);
        }
        

        $pregunta->loadCount('opcions');
        $pregunta->n_opcions=$pregunta->opcions_count;
        $pregunta->save();
        $pregunta->refresh();
        return response($pregunta,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Pregunta  $pregunta
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $pregunta = Pregunta::findOrFail($request->id);
        Gate::authorize('author-pregunta', $pregunta);

        $pregunta->palabclvs()->detach();
        $pregunta->opcions()->detach();
        $pregunta->delete();
    }
}
