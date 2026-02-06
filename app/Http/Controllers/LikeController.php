<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    /**
     * Like a post
     */
    public function store(Request $request, Post $post)
    {
        // Check if user already liked this post
        $existingLike = Like::where('user_id', auth()->id())
            ->where('post_id', $post->id)
            ->first();

        if ($existingLike) {
            return response()->json([
                'success' => false,
                'message' => 'You already liked this post',
            ], 422);
        }

        // Create the like
        Like::create([
            'user_id' => auth()->id(),
            'post_id' => $post->id,
        ]);

        // Get updated likes count
        $likesCount = $post->likes()->count();

        return response()->json([
            'success' => true,
            'message' => 'Post liked',
            'likes_count' => $likesCount,
        ], 201);
    }

    /**
     * Unlike a post
     */
    public function destroy(Post $post)
    {
        // Find and delete the like
        $like = Like::where('user_id', auth()->id())
            ->where('post_id', $post->id)
            ->first();

        if (!$like) {
            return response()->json([
                'success' => false,
                'message' => 'You have not liked this post',
            ], 422);
        }

        $like->delete();

        // Get updated likes count
        $likesCount = $post->likes()->count();

        return response()->json([
            'success' => true,
            'message' => 'Like removed',
            'likes_count' => $likesCount,
        ], 200);
    }
}
