<?php

namespace App\Models\Informacion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Informacion extends Model
{
    use SoftDeletes;
    protected $table = 'informacion';
    
    public function subTema(){
        return $this->belongsTo('App\Models\Informacion\SubTema','catalogo_subtema_id');
    }
    
    public function user(){
        return $this->belongsTo('App\Models\User','user_id');
    }
}