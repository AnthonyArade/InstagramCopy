<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Each post gets 0-20 likes
        Post::all()->each(function ($post) {
            $likeCount = rand(0, 20);
            $userIds = \App\Models\User::inRandomOrder()
                ->limit($likeCount)
                ->pluck('id');

            foreach ($userIds as $userId) {
                try {
                    Like::create([
                        'user_id' => $userId,
                        'post_id' => $post->id,
                    ]);
                } catch (\Exception $e) {
                    // Skip duplicate likes
                }
            }
        });
    }
}
