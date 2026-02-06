<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get 5 random users that the current user doesn't follow
     */
    public function suggestions(Request $request)
    {
        $currentUserId = auth()->id();

        // Get IDs of users that the current user is following
        $followingIds = auth()->user()->following()
            ->pluck('following_id')
            ->toArray();

        // Add the current user's ID to exclude them from suggestions
        $excludeIds = array_merge($followingIds, [$currentUserId]);

        // Get 5 random users that are not followed and not the current user
        $suggestedUsers = User::whereNotIn('id', $excludeIds)
            ->inRandomOrder()
            ->limit(5)
            ->select('id', 'username', 'email')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $suggestedUsers,
        ]);
    }
}
