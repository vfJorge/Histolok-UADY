<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Palabclv extends Model
{
    use HasFactory;
    protected $fillable = [
        'keyword'
    ];

    protected $hidden = [
        'id',
        'timestamps',
        'pivot',
        'created_at',
        'updated_at'
    ];
    public function fotos(){
        return $this->belongsToMany(\App\Models\Foto::class);
    }
}
