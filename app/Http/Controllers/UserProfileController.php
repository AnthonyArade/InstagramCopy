<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    /**
     * Display a user's profile with their posts
     */
    public function show(User $user)
    {
        // Get all posts by the user
        $posts = $user->posts()
            ->with(['likes', 'comments.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get follower and following counts
        $followersCount = $user->followers()->count();
        $followingCount = $user->following()->count();
        $postsCount = $posts->count();

        // Check if current user is following this user
        $isFollowing = false;
        if (auth()->check()) {
            $isFollowing = auth()->user()->following()
                ->where('following_id', $user->id)
                ->exists();
        }

        return Inertia::render('User/Profile', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'bio' => $user->bio,
                'profile_picture' => $user->profile_picture,
                'posts_count' => $postsCount,
                'followers_count' => $followersCount,
                'following_count' => $followingCount,
            ],
            'posts' => $posts,
            'isFollowing' => $isFollowing,
            'isOwnProfile' => auth()->check() && auth()->id() === $user->id,
        ]);
    }
}
