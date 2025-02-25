<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoPersonal extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_personal';
    protected $fillable = [
        'descripcion',
        'cargo',
        'user_id'
    ];

    public function cargo(){
        return $this->hasOne('App\Models\Capacitacion\RelTrabajadorPuesto', "catalogo_personal_id", "id");
    }
    
    public function capacitaciones(){
        return $this->hasMany('App\Models\Capacitacion\RelTrabajadorCapacitacion', "catalogo_personal_id", "id");
    }
}
