<?php

namespace App\Models\Informacion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubTema extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_subtema';
    

    public function departamento(){
        return $this->belongsTo('App\Models\Informacion\Departamento','catalogo_departamento_id');
    }

    public function informacion(){
        return $this->HasOne('App\Models\Informacion\Informacion','catalogo_subtema_id', "id")->orderBy("created_at","desc");
    }
}