<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Each user has 0-5 conversations with 2 users each
        User::all()->each(function ($user) {
            $conversationCount = rand(0, 5);
            $otherUsers = User::where('id', '!=', $user->id)
                ->inRandomOrder()
                ->limit($conversationCount)
                ->pluck('id');

            foreach ($otherUsers as $otherUserId) {
                // Only create conversation if it doesn't exist and to avoid duplicates
                $existingConversation = Conversation::where(function ($query) use ($user, $otherUserId) {
                    $query->where('user1_id', $user->id)->where('user2_id', $otherUserId)
                        ->orWhere('user1_id', $otherUserId)->where('user2_id', $user->id);
                })->exists();

                if (!$existingConversation) {
                    try {
                        Conversation::create([
                            'user1_id' => min($user->id, $otherUserId),
                            'user2_id' => max($user->id, $otherUserId),
                        ]);
                    } catch (\Exception $e) {
                        // Skip duplicate conversations
                    }
                }
            }
        });
    }
}
