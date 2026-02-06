<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display the dashboard/feed with posts
     */
    public function index(Request $request)
    {
        $query = Post::with(['user', 'likes', 'comments.user']);

        // Exclude current user's own posts
        $query->where('user_id', '!=', auth()->id());

        // Filter by following if requested
        if ($request->query('filter') === 'following') {
            $followingIds = auth()->user()->following()
                ->pluck('following_id')
                ->toArray();

            $query->whereIn('user_id', $followingIds);
        }

        $posts = $query->orderBy('created_at', 'desc')
            ->paginate(10);

        // Build user_likes object: postId => true/false
        $user_likes = [];
        foreach ($posts->items() as $post) {
            $user_likes[$post->id] = $post->likes
                ->where('user_id', auth()->id())
                ->count() > 0;
        }

        // Build user_follows object: userId => true/false
        $user_follows = [];
        $followingIds = auth()->user()->following()
            ->pluck('following_id')
            ->toArray();

        foreach ($posts->items() as $post) {
            if (!isset($user_follows[$post->user_id])) {
                $user_follows[$post->user_id] = in_array($post->user_id, $followingIds);
            }
        }

        return Inertia::render('Dashboard', [
            'posts' => $posts,
            'filter' => $request->query('filter', 'for_you'),
            'user_likes' => $user_likes,
            'user_follows' => $user_follows,
        ]);
    }

    /**
     * Load more posts for infinite scroll (returns JSON)
     */
    public function loadMore(Request $request)
    {
        $query = Post::with(['user', 'likes', 'comments.user']);

        // Exclude current user's own posts
        $query->where('user_id', '!=', auth()->id());

        // Filter by following if requested
        if ($request->query('filter') === 'following') {
            $followingIds = auth()->user()->following()
                ->pluck('following_id')
                ->toArray();

            $query->whereIn('user_id', $followingIds);
        }

        $posts = $query->orderBy('created_at', 'desc')
            ->paginate(10);

        // Build user_likes object: postId => true/false
        $user_likes = [];
        foreach ($posts->items() as $post) {
            $user_likes[$post->id] = $post->likes
                ->where('user_id', auth()->id())
                ->count() > 0;
        }

        // Build user_follows object: userId => true/false
        $user_follows = [];
        $followingIds = auth()->user()->following()
            ->pluck('following_id')
            ->toArray();

        foreach ($posts->items() as $post) {
            if (!isset($user_follows[$post->user_id])) {
                $user_follows[$post->user_id] = in_array($post->user_id, $followingIds);
            }
        }

        return response()->json([
            'posts' => $posts,
            'user_likes' => $user_likes,
            'user_follows' => $user_follows,
        ]);
    }

    /**
     * Show the create post page
     */
    public function create()
    {
        return Inertia::render('Post/Create');
    }

    /**
     * Store a newly created post
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image_url' => 'required|url',
            'caption' => 'nullable|string|max:2200',
        ]);

        $post = Post::create([
            'user_id' => auth()->id(),
            'image_url' => $validated['image_url'],
            'caption' => $validated['caption'] ?? null,
        ]);

        return redirect()->route('users.profile', auth()->id())
            ->with('success', 'Post created successfully!');
    }
}
