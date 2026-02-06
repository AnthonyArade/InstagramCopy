<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Follow a user
     */
    public function store(Request $request, User $user)
    {
        $currentUserId = auth()->id();

        // Prevent self-follow
        if ($currentUserId === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot follow yourself',
            ], 422);
        }

        // Check if already following
        $existingFollow = Follow::where('follower_id', $currentUserId)
            ->where('following_id', $user->id)
            ->first();

        if ($existingFollow) {
            return response()->json([
                'success' => false,
                'message' => 'You already follow this user',
            ], 422);
        }

        // Create the follow
        Follow::create([
            'follower_id' => $currentUserId,
            'following_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Following user',
        ], 201);
    }

    /**
     * Unfollow a user
     */
    public function destroy(User $user)
    {
        $currentUserId = auth()->id();

        // Find and delete the follow
        $follow = Follow::where('follower_id', $currentUserId)
            ->where('following_id', $user->id)
            ->first();

        if (!$follow) {
            return response()->json([
                'success' => false,
                'message' => 'You are not following this user',
            ], 422);
        }

        $follow->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unfollowed user',
        ], 200);
    }
}
