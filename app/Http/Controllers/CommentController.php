<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request, Post $post)
    {
        // Validate the comment content
        $validated = $request->validate([
            'content' => 'required|string|max:500',
        ]);

        // Create the comment
        $comment = $post->comments()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        // Return the created comment as JSON (for frontend to handle)
        return response()->json([
            'success' => true,
            'comment' => $comment->load('user'),
        ], 201);
    }
}
