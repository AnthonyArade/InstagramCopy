<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Follow;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Each user follows 0-50 random users
        User::all()->each(function ($user) {
            $followCount = rand(0, 50);
            $usersToFollow = User::where('id', '!=', $user->id)
                ->inRandomOrder()
                ->limit($followCount)
                ->pluck('id');

            foreach ($usersToFollow as $followingId) {
                try {
                    Follow::create([
                        'follower_id' => $user->id,
                        'following_id' => $followingId,
                    ]);
                } catch (\Exception $e) {
                    // Skip duplicate follows
                }
            }
        });
    }
}
