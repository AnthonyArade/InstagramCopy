import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useCallback } from 'react';

export default function UserProfile({ user, posts, isFollowing, isOwnProfile, auth }) {
    const [followed, setFollowed] = useState(isFollowing);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const handleFollow = useCallback(async () => {
        try {
            setLoadingFollow(true);
            await window.axios.post(route('follows.store', user.id));
            setFollowed(true);
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setLoadingFollow(false);
        }
    }, [user.id]);

    const handleUnfollow = useCallback(async () => {
        try {
            setLoadingFollow(true);
            await window.axios.delete(route('follows.destroy', user.id));
            setFollowed(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        } finally {
            setLoadingFollow(false);
        }
    }, [user.id]);

    return (
        <AuthenticatedLayout>
            <Head title={`${user.username}'s Profile`} />

            <div className="ml-28 bg-gray-900 min-h-screen text-white">
                {/* Profile Header */}
                <div className="max-w-6xl mx-auto px-4 py-8 border-b border-gray-700">
                    <div className="flex gap-8 items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600" />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-grow">
                            {/* Username and Follow Button / Settings Button */}
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-3xl font-bold">{user.username}</h1>
                                {isOwnProfile ? (
                                    <Link
                                        href={route('profile.edit')}
                                        className="px-8 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        Settings
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => (followed ? handleUnfollow() : handleFollow())}
                                        disabled={loadingFollow}
                                        className={`px-8 py-2 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                            followed
                                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {followed ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 mb-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{user.posts_count}</p>
                                    <p className="text-gray-400 text-sm">Posts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{user.followers_count}</p>
                                    <p className="text-gray-400 text-sm">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{user.following_count}</p>
                                    <p className="text-gray-400 text-sm">Following</p>
                                </div>
                            </div>

                            {/* Bio */}
                            {user.bio && (
                                <div>
                                    <p className="text-white break-words">{user.bio}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {posts.length > 0 ? (
                        <>
                            <h2 className="text-xl font-bold mb-6">Posts</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:opacity-80 transition"
                                    >
                                        {/* Post Image */}
                                        {post.image_url ? (
                                            <img
                                                src={post.image_url}
                                                alt={post.caption}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                                <svg
                                                    className="w-12 h-12 text-gray-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Overlay with Stats */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100 transition">
                                            <div className="flex items-center gap-2 text-white">
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                                <span className="font-semibold">{post.likes_count}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white">
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                    />
                                                </svg>
                                                <span className="font-semibold">{post.comments_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No posts yet</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
