<?php

namespace Database\Factories\Capacitacion;

use App\Models\Capacitacion\Capacitacion;
use Illuminate\Database\Eloquent\Factories\Factory;

class CapacitacionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    protected $model = Capacitacion::class;
    public function definition()
    {
        return [
            'descripcion' => $this->faker->sentence(7),
        ];
    }
}
