<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Foto extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'desc',
        'imagen'
    ];
    
    protected $hidden = [
        //'filename',
        'pivot'
    ];
    //protected $casts = ['keywords'=>'array'];

    public function user(){
        return $this->belongsTo(\App\Models\User::class);
    }

    public function palabclvs(){
        return $this->belongsToMany(\App\Models\Palabclv::class)->withTimestamps();
    }

    public function preguntas(){
        return $this->hasMany(\App\Models\Pregunta::class);
    }
}
