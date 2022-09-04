<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    use HasFactory;
    
    public function users(){
        return $this->belongsToMany(\App\Models\User::class)->withTimestamps();;
    }
    protected $hidden = [
        //'filename',
        'pivot'
    ];
    
    public function user(){
        return $this->belongsTo(\App\Models\User::class);
    }
}
