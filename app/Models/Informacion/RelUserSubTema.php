<?php

namespace App\Models\Informacion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelUserSubTema extends Model
{
    use SoftDeletes;
    protected $table = 'rel_user_subtema';
    

    public function subTema(){
        return $this->belongsTo('App\Models\Informacion\Subtema','catalogo_subtema_id');
    }
}