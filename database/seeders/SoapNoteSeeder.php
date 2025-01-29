<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SOAPNote;
use App\Models\User;

class SoapNoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();

        foreach ($users as $user) {
            SoapNote::factory(5)->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
