<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a random Picsum image ID
        $imageId = rand(0, 1000);
        $picsumUrl = "https://picsum.photos/id/{$imageId}/600/600";

        return [
            'user_id' => \App\Models\User::factory(),
            'image_url' => $picsumUrl,
            'caption' => fake()->optional(0.7)->sentence(10),
        ];
    }
}
