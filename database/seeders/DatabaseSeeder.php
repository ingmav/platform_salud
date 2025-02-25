<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(){
        \App\Models\User::create([
            'name' => 'Usuario Root',
            'username' => 'root',
            'password' => Hash::make('trig.plataforma$'),
            'email' => 'root@localhost',
            'is_superuser' => 1,
            'avatar' => 'assets/avatars/50-king.svg',
            'status' => 2,
        ]);
           
        $this->call(PermissionsTableSeeder::class);
    }
}
