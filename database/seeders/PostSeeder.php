<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Each of 100 users creates 5-10 posts
        User::all()->each(function ($user) {
            Post::factory(rand(5, 10))->for($user)->create();
        });
    }
}
