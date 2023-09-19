<?php
namespace App\Http\Controllers;

use App\Models\Examen;
use App\Models\Pregunta;
use App\Models\Opcion;
use App\Models\Palabclv;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

define("TIMEZONE", "America/Belize");

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

    public function owned(Request $request)
    {
        $examen = Examen::with(['palabclvs','preguntas.foto:id,filename'])->where('user_id',auth()->user()->id)->get();

        return response($examen,200);
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
    //CAMBIAR EL ACCESO A LAS RESPUESTAS
    public function show(Request $request)
    {
        $examen = Examen::with(['palabclvs','user:id,name','preguntas:id,title,question,foto_id','preguntas.opcions','preguntas.foto:id,filename'])->findOrFail($request->id);
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

    public function start(Request $request)
    {
        
        $examen = Examen::findOrFail($request->id);
        
        $mytime = Carbon::now(TIMEZONE)->toDateTimeString();
        $now = strtotime($mytime);

        $user_id = auth()->user()->id;
            //Log
            $directorio = 'logs/'.$user_id.'/';
            $nombre = $user_id."_".$examen->id.".txt";
        //si existe un examen iniciado anterior
        if($examen->users()->where('user_id',$user_id)->exists()){
            $pivot = $examen->users()->where('user_id',$user_id)->latest('start_time')->firstOrFail()->pivot;
            $start_time = strtotime($pivot->start_time);
            $dur = $this->addTime($examen->duration);
            $end_time = $start_time+$dur;
            //echo date('Y-m-d H:i:s', $now)."  ".date('Y-m-d H:i:s', $start_time)."  ".$mytime;
            //y sigue estando activo
            if($end_time > $now && $pivot->end_time==NULL){
                return response(["mensaje"=>"Este examen ya se inicio y no ha finalizado"],400);
            }
            //o ya expiro (lo guarda)
            elseif($end_time < $now && $pivot->end_time==NULL){
                $linea = $mytime." ".$pivot->n_correct;
                Storage::disk('local')->append($directorio.$nombre, $linea);
                $query = DB::table('examen_user')->where('id', $pivot->id)->update(['end_time' => $mytime]);
            }
        }
        //Nuevo examen
        $examen->users()->attach(auth()->user()->id);
        
            //Cache
            Cache::forget('results-'.$examen->id."-".$user_id);
            $resultados=[];
            Cache::put('results-'.$examen->id."-".$user_id, $resultados);
            //Log
            $primeraLinea = $examen->id." ".$mytime." ".$examen->n_questions." ".$examen->duration;
            Storage::disk('local')->append($directorio.$nombre, $primeraLinea);
        return $examen->preguntas()->with(['opcions:id,opcion'])->first()->makeHidden(['answer_id','user_id','access']);
    }

    public function current(Request $request)
    {
        $examen = Examen::findOrFail($request->id);
        $mytime = Carbon::now(TIMEZONE)->toDateTimeString();
        $user_id = auth()->user()->id;
        //si existe un examen iniciado anterior
        if($examen->users()->where('user_id',$user_id)->exists()){
            $pivot = $examen->users()->where('user_id',$user_id)->latest('start_time')->firstOrFail()->pivot;
            $start_time = strtotime($pivot->start_time);
            $dur = $this->addTime($examen->duration);
            $end_time = $start_time+$dur;
            $now = strtotime($mytime);
            //echo date('Y-m-d H:i:s', $now)."  ".date('Y-m-d H:i:s', $end_time);
            //y sigue estando activo
            if($end_time > $now && $pivot->end_time==NULL){
                $preguntas = $examen->preguntas()->with(['opcions:id,opcion','foto:id,filename'])->get()->makeHidden(['answer_id','user_id','access']);;
                $pregunta = $preguntas[$pivot->n_answered];
                $preguntasRestantes = $examen->n_questions - $pivot->n_answered-1;
                return response(['faltan'=>$preguntasRestantes,'pregunta'=>$pregunta],200);
            }
            elseif($end_time < $now && $pivot->end_time==NULL){
                return response(["mensaje"=>"Este examen no se encuentra iniciado o ya acabó"],400);
            }
            else response(["mensaje"=>"aa"],400);
        }
    }

    public function next(Request $request)
    {
        $request->validate([
            'tiempo_inicio'=> 'date',
            'tiempo_selec'=> 'date',
            'tiempo_sig'=> 'date'
            
        ]);
        $examen = Examen::findOrFail($request->id);
        $mytime = Carbon::now(TIMEZONE)->toDateTimeString();
        $user_id = auth()->user()->id;
        //si existe un examen iniciado anterior
        if($examen->users()->where('user_id',$user_id)->exists()){
            $pivot = $examen->users()->where('user_id',$user_id)->latest('start_time')->first()->pivot;
            //si end_time no es null, entonces ya finalizo el ultimo examen
            if($pivot->end_time!=NULL){
                return response(["error"=>"Este examen no se encuentra iniciado o ya acabó"],400);
            }

            $start_time = strtotime($pivot->start_time);
            $dur = $this->addTime($examen->duration);
            $end_time = $start_time+$dur;
            $now = strtotime($mytime);

            $directorio = 'logs/'.$user_id.'/';
            $nombre = $user_id."_".$examen->id.".txt";

            //SI YA ACABO EL TIEMPO del examen
            if($end_time < $now){
                $linea = $mytime." ".$pivot->n_correct;
                Storage::disk('local')->append($directorio.$nombre, $linea);
                $query = DB::table('examen_user')->where('id', $pivot->id)->update(['end_time' => $mytime]);

                return response(["error"=>"El tiempo del examen ya acabo (y se guardaron sus datos)"],400);
            }
            //Si el examen sigue activo
            else{
                $i = $pivot->n_answered;
                
                //si ya se contestaron todas (inalcanzable?)
                if($i >= $examen->n_questions){
                    return response(["error"=>"Este examen ya acabó"],400);
                }

                $preguntas = $examen->preguntas()->with(['opcions:id,opcion'])->get();
                $pregunta = $preguntas[$i];
                $linea = $request->tiempo_inicio." ".$request->tiempo_selec." ".$request->tiempo_sig;

                $nCorrect=$pivot->n_correct;

                $resultados = Cache::get('results-'.$examen->id."-".$user_id);
                //Si es la respuesta correcta
                if($pregunta->answer_id == $request->option_id){
                    $nCorrect++;
                    $linea = $linea." 1";

                    $resultados[$i]="".$pregunta->answer_id;
                //Si no es la respuesta correcta
                } else {
                    $linea = $linea." 0";

                    $resultados[$i]=$pregunta->answer_id.",".$request->option_id;
                }
                //Cache
                Cache::put('results-'.$examen->id."-".$user_id, $resultados);
                //Log
                Storage::disk('local')->append($directorio.$nombre, $linea);

                $tiempo=NULL;
                $lineaFinal = $mytime." ";
                //Si es la ultima pregunta del examen
                if ($i+1 == $examen->n_questions) {
                    $tiempo=$mytime;
                    $lineaFinal = $lineaFinal.$nCorrect;
                    Storage::disk('local')->append($directorio.$nombre, $lineaFinal);
                    $respuesta = "Fin del examen";
                    $llave = 'mensaje';
                //Si no era la ultima pregunta
                } else {
                    $llave ='siguiente';
                    $respuesta =  $preguntas[$i+1]->makeHidden(['answer_id','user_id','access']);
                }
                $this->updateExamen($pivot->id,$pivot->n_answered+1,$nCorrect,$tiempo);
                return response(['answer_id'=>$pregunta->answer_id,$llave=>$respuesta],200);
            }
        }
        else{
            return response(["error"=>"Este examen no se encuentra iniciado"],400);
        }
        
    }
    
    public function results(Request $request)
    {
        $examen = Examen::findOrFail($request->id);
        $user_id = auth()->user()->id;
        //si existe un examen iniciado anterior
        if($examen->users()->where('user_id',$user_id)->exists()){
            $pivot = $examen->users()->where('user_id',$user_id)->latest('end_time')->first()->pivot;
            //si end_time no es null, entonces ya finalizo el ultimo examen
            if($pivot->end_time!=NULL){
                $resultados = Cache::get('results-'.$examen->id."-".$user_id);
                return response(["pivote"=>$pivot,"respuestas"=>$resultados],200);
            }
            else{
                return response(["error"=>"Este examen no ha acabado"],400);
            }
        }
        else{
            return response(["error"=>"No se ha contesado ningun examen"],400);
        }
    }

    public function medallero(Request $request){

        $query = DB::table('examen_user')
            ->join('users', 'examen_user.user_id', '=', 'users.id')
            ->where('examen_id', $request->id)
            ->where('end_time','!=', null)
            ->orderBy('start_time', 'asc')
            ->select('name','n_correct','start_time','end_time')
            ->get();

        $query = $query->unique('name');

        foreach($query as $user){
            $user->duracion = strtotime($user->end_time)-strtotime($user->start_time);
            
        }
        $sorted = $query->sortBy([
            ['n_correct', 'desc'],
            ['duracion', 'asc'],
        ]);
        return $sorted;
    }

    public function addTime(string $time){
        $time_arr =  explode(":",$time);
        $hours = $time_arr[0];
        $min = $time_arr[1];
        $seg = $time_arr[2];
        return  $hours*3600+$min*60+$seg;
    }

    public function updateExamen($id, $n_answered, $n_correct,$end_time)
    {
        $query = DB::table('examen_user')
            ->where('id', $id)
            ->update(['n_answered' => $n_answered,'n_correct' => $n_correct,'end_time' => $end_time]);
    }
} 