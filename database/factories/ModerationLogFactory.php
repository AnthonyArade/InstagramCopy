<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ModerationLog>
 */
class ModerationLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'moderator_id' => \App\Models\User::factory(),
            'action_type' => fake()->randomElement(['delete', 'suspend', 'warn', 'approve']),
            'target_type' => fake()->randomElement(['post', 'comment', 'user']),
            'target_id' => fake()->randomNumber(5),
            'reason' => fake()->optional(0.6)->sentence(5, true),
        ];
    }
}
