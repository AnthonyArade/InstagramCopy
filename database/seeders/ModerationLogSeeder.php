<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ModerationLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModerationLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50-100 random moderation logs
        $moderators = User::where('role', '!=', 'user')
            ->pluck('id')
            ->toArray();

        if (empty($moderators)) {
            // If no moderators exist, create some
            $moderators = User::inRandomOrder()
                ->limit(5)
                ->pluck('id')
                ->toArray();
        }

        for ($i = 0; $i < rand(50, 100); $i++) {
            ModerationLog::factory()
                ->state([
                    'moderator_id' => $moderators[array_rand($moderators)],
                ])
                ->create();
        }
    }
}
