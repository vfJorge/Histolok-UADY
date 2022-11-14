<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    use HasFactory;
    protected $fillable = [
        'titulo',
        'pregunta',
        'keyword'
    ];
    protected $hidden = [
        'pivot'
    ];

    public function opcions(){
        return $this->belongsToMany(\App\Models\Opcion::class)->withTimestamps();
    }

    public function palabclvs(){
        return $this->belongsToMany(\App\Models\Palabclv::class)->withTimestamps();
    }

    public function user(){ //propietario
        return $this->belongsTo(\App\Models\User::class);
    }

    public function foto(){ //a que foto pértenece la pregunta
        return $this->belongsTo(\App\Models\Foto::class);
    }

    /* public function fotoFilename(){ 
        return $this->belongsTo(\App\Models\Foto::class);
    } */

    public function examens(){
        return $this->belongsToMany(\App\Models\Examen::class)->withTimestamps();
    }
    
}
