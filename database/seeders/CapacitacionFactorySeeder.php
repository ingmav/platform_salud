<?php

namespace Database\Seeders;

use App\Models\Capacitacion\Capacitacion;
use Illuminate\Database\Seeder;

class CapacitacionFactorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Capacitacion::factory()->count(10)->create();
    }
}
