<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConversationController extends Controller
{
    /**
     * Display all conversations for the authenticated user
     */
    public function index()
    {
        $conversations = Conversation::with(['user1', 'user2', 'messages' => function ($query) {
            $query->latest()->limit(1);
        }])
        ->where(function ($query) {
            $query->where('user1_id', auth()->id())
                  ->orWhere('user2_id', auth()->id());
        })
        ->latest('updated_at')
        ->paginate(20);

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Display messages for a specific conversation (API)
     */
    public function show(Conversation $conversation)
    {
        // Check if user is part of this conversation
        if ($conversation->user1_id !== auth()->id() && $conversation->user2_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Load all messages with user info
        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    /**
     * Create a new conversation with a user
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $otherUserId = $validated['user_id'];
        $currentUserId = auth()->id();

        // Check if conversation already exists
        $conversation = Conversation::where(function ($query) use ($currentUserId, $otherUserId) {
            $query->where('user1_id', $currentUserId)
                  ->where('user2_id', $otherUserId);
        })->orWhere(function ($query) use ($currentUserId, $otherUserId) {
            $query->where('user1_id', $otherUserId)
                  ->where('user2_id', $currentUserId);
        })->first();

        // If conversation doesn't exist, create it
        if (!$conversation) {
            $conversation = Conversation::create([
                'user1_id' => $currentUserId,
                'user2_id' => $otherUserId,
            ]);
        }

        // Load with relationships
        $conversation->load(['user1', 'user2', 'messages']);

        return response()->json([
            'success' => true,
            'conversation' => $conversation,
        ], 201);
    }
}
