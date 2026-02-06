<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FollowerController extends Controller
{
    /**
     * Get all followers of the authenticated user
     */
    public function index()
    {
        $followers = auth()->user()->followers()
            ->with('follower')
            ->get()
            ->map(function ($follow) {
                return $follow->follower;
            });

        return response()->json([
            'success' => true,
            'followers' => $followers,
        ]);
    }
}
