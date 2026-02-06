<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Each conversation has 2-10 messages
        Conversation::all()->each(function ($conversation) {
            $messageCount = rand(2, 10);
            $users = [$conversation->user1_id, $conversation->user2_id];

            for ($i = 0; $i < $messageCount; $i++) {
                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $users[array_rand($users)],
                    'content' => fake()->sentence(5, true),
                ]);
            }
        });
    }
}
