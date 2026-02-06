import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Dashboard() {
    const { posts: initialPosts = { data: [] }, filter = 'for_you', user_likes: initialUserLikes = {}, user_follows: initialUserFollows = {} } = usePage().props;
    const { auth } = usePage().props;
    const [posts, setPosts] = useState(initialPosts);
    const [likedPosts, setLikedPosts] = useState(initialUserLikes);
    const [followedUsers, setFollowedUsers] = useState(initialUserFollows);
    const [expandedComments, setExpandedComments] = useState({});
    const [showComments, setShowComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
    const [loadingLikes, setLoadingLikes] = useState({});
    const [loadingFollows, setLoadingFollows] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(posts.current_page || 1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMorePages, setHasMorePages] = useState(posts.last_page ? posts.last_page > 1 : false);
    const observerTarget = useRef(null);

    // Suggested users state
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(posts.current_page || 1);
        setHasMorePages(posts.last_page ? posts.last_page > 1 : false);
    }, [filter]);

    // Load suggested users on mount
    useEffect(() => {
        const loadSuggestedUsers = async () => {
            try {
                setLoadingSuggestions(true);
                const response = await window.axios.get(route('users.suggestions'));
                setSuggestedUsers(response.data.users || []);
            } catch (error) {
                console.error('Error loading suggested users:', error);
            } finally {
                setLoadingSuggestions(false);
            }
        };
        loadSuggestedUsers();
    }, []);

    const handleLike = async (post) => {
        try {
            setLoadingLikes((prev) => ({ ...prev, [post.id]: true }));

            const response = await window.axios.post(route('likes.store', { post: post.id }));

            if (response.status === 201) {
                // Update state with the like
                setLikedPosts((prev) => ({ ...prev, [post.id]: true }));
                setPosts((prevPosts) => ({
                    ...prevPosts,
                    data: prevPosts.data.map((p) =>
                        p.id === post.id
                            ? { ...p, likes_count: response.data.likes_count }
                            : p
                    ),
                }));
            }
        } catch (error) {
            console.error('Error liking post:', error.response?.data || error.message);
        } finally {
            setLoadingLikes((prev) => ({ ...prev, [post.id]: false }));
        }
    };

    const handleUnlike = async (post) => {
        try {
            setLoadingLikes((prev) => ({ ...prev, [post.id]: true }));

            const response = await window.axios.delete(route('likes.destroy', { post: post.id }));

            if (response.status === 200) {
                // Update state with the unlike
                setLikedPosts((prev) => ({ ...prev, [post.id]: false }));
                setPosts((prevPosts) => ({
                    ...prevPosts,
                    data: prevPosts.data.map((p) =>
                        p.id === post.id
                            ? { ...p, likes_count: response.data.likes_count }
                            : p
                    ),
                }));
            }
        } catch (error) {
            console.error('Error unliking post:', error.response?.data || error.message);
        } finally {
            setLoadingLikes((prev) => ({ ...prev, [post.id]: false }));
        }
    };

    const handleFollow = async (userId) => {
        try {
            setLoadingFollows((prev) => ({ ...prev, [userId]: true }));

            const response = await window.axios.post(route('follows.store', { user: userId }));

            if (response.status === 201) {
                setFollowedUsers((prev) => ({ ...prev, [userId]: true }));
            }
        } catch (error) {
            console.error('Error following user:', error.response?.data || error.message);
        } finally {
            setLoadingFollows((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            setLoadingFollows((prev) => ({ ...prev, [userId]: true }));

            const response = await window.axios.delete(route('follows.destroy', { user: userId }));

            if (response.status === 200) {
                setFollowedUsers((prev) => ({ ...prev, [userId]: false }));
            }
        } catch (error) {
            console.error('Error unfollowing user:', error.response?.data || error.message);
        } finally {
            setLoadingFollows((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const loadMorePosts = useCallback(async () => {
        if (isLoadingMore || !hasMorePages) {
            console.log('Skipping load: isLoadingMore=', isLoadingMore, 'hasMorePages=', hasMorePages);
            return;
        }

        try {
            setIsLoadingMore(true);
            const nextPage = currentPage + 1;

            console.log('Loading page', nextPage, 'filter:', filter);

            const response = await window.axios.get(route('posts.loadMore'), {
                params: {
                    page: nextPage,
                    filter: filter,
                },
            });

            // Extract data from response
            const newPostsData = response.data.posts || { data: [] };
            const newUserLikes = response.data.user_likes || {};
            const newUserFollows = response.data.user_follows || {};

            console.log('Loaded page', nextPage, 'with', newPostsData.data?.length || 0, 'posts. Last page:', newPostsData.last_page);

            // Append new posts
            setPosts((prevPosts) => ({
                ...prevPosts,
                data: [...prevPosts.data, ...newPostsData.data],
                current_page: newPostsData.current_page,
                last_page: newPostsData.last_page,
            }));

            // Update pagination state
            setCurrentPage(nextPage);
            setHasMorePages(nextPage < newPostsData.last_page);

            // Merge likes and follows
            setLikedPosts((prev) => ({ ...prev, ...newUserLikes }));
            setFollowedUsers((prev) => ({ ...prev, ...newUserFollows }));
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [currentPage, isLoadingMore, hasMorePages, filter]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMorePages && !isLoadingMore) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMorePosts, hasMorePages, isLoadingMore]);

    const handleCommentSubmit = async (postId) => {
        if (!commentText[postId]?.trim()) return;

        try {
            setLoadingComments((prev) => ({ ...prev, [postId]: true }));

            const response = await window.axios.post(route('comments.store', { post: postId }), {
                content: commentText[postId],
            });

            if (response.status === 201) {
                const data = response.data;

                // Update the posts state to include the new comment
                setPosts((prevPosts) => ({
                    ...prevPosts,
                    data: prevPosts.data.map((post) => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                comments: [...(post.comments || []), data.comment],
                                comments_count: (post.comments_count || 0) + 1,
                            };
                        }
                        return post;
                    }),
                }));

                // Clear the input
                setCommentText((prev) => ({ ...prev, [postId]: '' }));
            }
        } catch (error) {
            console.error('Error posting comment:', error.response?.data || error.message);
        } finally {
            setLoadingComments((prev) => ({ ...prev, [postId]: false }));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Feed" />

            <div className="min-h-screen bg-gray-900">
                {/* Feed Container */}
                <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Feed Toggle */}
                    <div className="mb-8 flex gap-4 border-b border-gray-700 bg-gray-900 rounded-t-lg">
                        <Link
                            href={route('dashboard')}
                            className={`flex-1 py-4 px-4 font-semibold text-center border-b-2 transition ${
                                filter === 'for_you'
                                    ? 'border-white text-white'
                                    : 'border-transparent text-gray-400 hover:text-gray-300'
                            }`}
                        >
                            For You
                        </Link>
                        <Link
                            href={route('dashboard', { filter: 'following' })}
                            className={`flex-1 py-4 px-4 font-semibold text-center border-b-2 transition ${
                                filter === 'following'
                                    ? 'border-white text-white'
                                    : 'border-transparent text-gray-400 hover:text-gray-300'
                            }`}
                        >
                            Following
                        </Link>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {posts && posts.data && posts.data.length > 0 ? (
                            posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-sm"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between border-b border-gray-700 p-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Link href={route('users.profile', post.user?.id)}>
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600 cursor-pointer hover:opacity-80 transition" />
                                            </Link>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Link href={route('users.profile', post.user?.id)}>
                                                        <p className="font-semibold text-white cursor-pointer hover:opacity-80 transition">
                                                            {post.user?.username || 'Unknown'}
                                                        </p>
                                                    </Link>
                                                    {post.user && post.user.id !== auth.user.id ? (
                                                        <button
                                                            onClick={() =>
                                                                followedUsers[post.user.id]
                                                                    ? handleUnfollow(post.user.id)
                                                                    : handleFollow(post.user.id)
                                                            }
                                                            disabled={loadingFollows[post.user.id]}
                                                            className={`px-3 py-1 rounded font-semibold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                                                                followedUsers[post.user.id]
                                                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                            }`}
                                                        >
                                                            {followedUsers[post.user.id] ? 'Following' : 'Follow'}
                                                        </button>
                                                    ) : null}
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-300">
                                            <svg
                                                className="h-5 w-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Post Image */}
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={post.image_url}
                                            alt={post.caption}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Post Actions */}
                                    <div className="px-4 pt-4 pb-2">
                                        <div className="flex gap-4 items-center">
                                            <button
                                                onClick={() =>
                                                    likedPosts[post.id]
                                                        ? handleUnlike(post)
                                                        : handleLike(post)
                                                }
                                                disabled={loadingLikes[post.id]}
                                                className="transition hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg
                                                    className={`h-6 w-6 ${
                                                        likedPosts[post.id]
                                                            ? 'fill-red-500 text-red-500'
                                                            : 'text-gray-400'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                            </button>
                                            <span className="text-sm text-gray-300">
                                                {post.likes_count || 0}
                                            </span>

                                            <button
                                                onClick={() => setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                                                className="transition hover:text-gray-300 ml-2">
                                                <svg
                                                    className="h-6 w-6 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                            </button>
                                            <span className="text-sm text-gray-300">
                                                {post.comments_count || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Post Caption */}
                                    {post.caption && (
                                        <div className="px-4 pt-1 pb-4">
                                            <p className="text-sm text-white">
                                                <span className="font-semibold">
                                                    {post.user?.username || 'Unknown'}
                                                </span>{' '}
                                                {post.caption}
                                            </p>
                                        </div>
                                    )}

                                    {/* Comments Section */}
                                    {showComments[post.id] && (
                                    <div className="p-4 border-t border-gray-700">
                                        {post.comments && post.comments.length > 0 && (
                                            <div className="mb-3 space-y-2">
                                                {post.comments
                                                    .slice(
                                                        0,
                                                        expandedComments[post.id]
                                                            ? post.comments.length
                                                            : 2,
                                                    )
                                                    .map((comment) => (
                                                        <p
                                                            key={comment.id}
                                                            className="text-sm text-gray-300"
                                                        >
                                                            <span className="font-semibold">
                                                                {comment.user?.username ||
                                                                    'Unknown'}
                                                            </span>{' '}
                                                            {comment.content}
                                                        </p>
                                                    ))}
                                                {post.comments.length > 2 && (
                                                    <button
                                                        onClick={() =>
                                                            setExpandedComments(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [post.id]:
                                                                        !prev[
                                                                            post.id
                                                                        ],
                                                                }),
                                                            )
                                                        }
                                                        className="text-xs text-gray-400 hover:text-gray-300"
                                                    >
                                                        {expandedComments[post.id]
                                                            ? 'Hide'
                                                            : `View all ${post.comments.length} comments`}
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Add Comment */}
                                        <div className="border-t border-gray-700 pt-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    value={commentText[post.id] || ''}
                                                    onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleCommentSubmit(post.id);
                                                        }
                                                    }}
                                                    className="flex-1 bg-gray-700 text-sm outline-none placeholder-gray-500 text-white rounded px-2 py-1"
                                                />
                                                <button
                                                    onClick={() => handleCommentSubmit(post.id)}
                                                    disabled={loadingComments[post.id]}
                                                    className="text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingComments[post.id] ? 'Posting...' : 'Post'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="rounded-lg border border-gray-700 bg-gray-800 p-12 text-center">
                                <svg
                                    className="mx-auto mb-4 h-12 w-12 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m0 0h6m-12-6H6m0 0H0"
                                    />
                                </svg>
                                <p className="text-gray-400">No posts yet. Follow users to see their posts!</p>
                            </div>
                        )}

                        {/* Loading indicator and infinite scroll trigger */}
                        {hasMorePages && (
                            <div ref={observerTarget} className="py-8 text-center">
                                {isLoadingMore && (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse animation-delay-200" />
                                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse animation-delay-400" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar for larger screens */}
                <div className="hidden lg:block absolute right-0 top-0 w-80 h-screen p-6 mt-20 bg-gray-900">
                    <Link href={route('users.profile', auth.user.id)} className="mb-8 block cursor-pointer hover:opacity-80 transition">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600" />
                            <div>
                                <p className="font-semibold text-white">{auth.user.username || auth.user.name}</p>
                                <p className="text-xs text-gray-400">{auth.user.email}</p>
                            </div>
                        </div>
                    </Link>

                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase text-gray-400 mb-4">Suggestions For You</p>
                        <div className="space-y-4">
                            {loadingSuggestions ? (
                                <p className="text-xs text-gray-400 text-center py-2">Loading... </p>
                            ) : suggestedUsers.length > 0 ? (
                                suggestedUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <Link href={route('users.profile', user.id)} className="flex items-center gap-2 flex-1">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600 cursor-pointer hover:opacity-80 transition" />
                                            <div className="text-sm cursor-pointer hover:opacity-80 transition">
                                                <p className="font-semibold text-white">{user.username}</p>
                                                <p className="text-xs text-gray-400">Suggested for you</p>
                                            </div>
                                        </Link>
                                        <div>
                                            <button
                                                onClick={() =>
                                                    followedUsers[user.id]
                                                        ? handleUnfollow(user.id)
                                                        : handleFollow(user.id)
                                                }
                                                disabled={loadingFollows[user.id]}
                                                className={`text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    followedUsers[user.id]
                                                        ? 'text-gray-400 hover:text-gray-300'
                                                        : 'text-blue-400 hover:text-blue-300'
                                                }`}
                                            >
                                                {followedUsers[user.id] ? 'Following' : 'Follow'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-2">No suggestions available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
