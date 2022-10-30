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
    public function users(){
        return $this->belongsToMany(\App\Models\User::class)->withPivot('id','start_time', 'end_time','n_answered','n_correct');
    }


    public function palabclvs(){
        return $this->belongsToMany(\App\Models\Palabclv::class)->withTimestamps();
    }

    public function preguntas(){
        return $this->belongsToMany(\App\Models\Pregunta::class);
    }

    public function primera_pregunta(){
        return $this->hasOne(\App\Models\Pregunta::class)->oldestOfMany();
    }
}
