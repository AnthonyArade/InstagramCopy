<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Each post gets 0-10 comments
        Post::all()->each(function ($post) {
            $commentCount = rand(0, 10);
            Comment::factory($commentCount)
                ->for($post)
                ->create();
        });
    }
}
