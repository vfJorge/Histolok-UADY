<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opcion extends Model
{
    use HasFactory;
    protected $fillable = [
        'opcion'
    ];
    protected $hidden = [
        //'id',
        'timestamps',
        'pivot',
        'created_at',
        'updated_at'
    ];
    public function preguntas(){
        return $this->belongsToMany(\App\Models\Pregunta::class);
    }
}
