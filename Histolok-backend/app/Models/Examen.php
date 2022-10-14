<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examen extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'desc',
        'n_questions',
        'difficulty',
        'duration',
    ];

    protected $hidden = [
        //'filename',
        'pivot'
    ];
    
    public function user(){
        return $this->belongsTo(\App\Models\User::class);
    }

    public function palabclvs(){
        return $this->belongsToMany(\App\Models\Palabclv::class)->withTimestamps();
    }

    public function preguntas(){
        return $this->belongsToMany(\App\Models\Pregunta::class);
    }
}
