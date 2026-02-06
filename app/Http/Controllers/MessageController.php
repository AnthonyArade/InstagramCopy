<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Store a newly created message in storage.
     */
    public function store(Request $request, Conversation $conversation)
    {
        // Check if user is part of this conversation
        if ($conversation->user1_id !== auth()->id() && $conversation->user2_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate the message content
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        // Create the message
        $message = $conversation->messages()->create([
            'sender_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        // Update conversation updated_at timestamp
        $conversation->touch();

        // Return the created message with sender info
        return response()->json([
            'success' => true,
            'message' => $message->load('sender'),
        ], 201);
    }
}
