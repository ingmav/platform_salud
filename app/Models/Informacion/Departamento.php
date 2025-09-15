<?php

namespace App\Models\Informacion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Departamento extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_departamento';
    

    public function subTema(){
        return $this->hasMany('App\Models\Informacion\SubTema', "catalogo_departamento_id", "id");
    }

    public function departamento_padre(){
        return $this->belongsTo('App\Models\Informacion\Departamento', "id_padre", "id");
    }
    
}