<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\SOAPNote;
use App\Models\User;

class SoapNoteFactory extends Factory
{
    protected $model = SoapNote::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(), // Ensure users exist
            'subjective' => $this->faker->sentence(),
            'objective' => $this->faker->sentence(),
            'assessment' => $this->faker->sentence(),
            'plan' => $this->faker->sentence(),
        ];
    }
}
