import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function CreatePost() {
    const { data, setData, post, processing, errors } = useForm({
        image_url: '',
        caption: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [urlError, setUrlError] = useState('');

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setData('image_url', url);
        setUrlError('');

        // Validate URL
        if (url) {
            try {
                new URL(url);
                setImagePreview(url);
            } catch (error) {
                setUrlError('Please enter a valid URL');
                setImagePreview(null);
            }
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!imagePreview) {
            setUrlError('Please provide a valid image URL');
            return;
        }
        post(route('posts.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Post" />

            <div className="ml-28 bg-gray-900 min-h-screen text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Create new post</h1>
                        <Link href={route('dashboard')} className="text-gray-400 hover:text-white transition">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Link>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                        {/* Image Preview */}
                        <div className="bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 aspect-square flex items-center justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={() => {
                                        setImagePreview(null);
                                        setUrlError('Failed to load image. Please check the URL.');
                                    }}
                                />
                            ) : (
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-16 w-16 text-gray-500 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-gray-400">Enter an image URL to preview</p>
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="flex flex-col gap-6">
                            {/* Image URL Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={data.image_url}
                                    onChange={handleImageUrlChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                />
                                {(errors.image_url || urlError) && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.image_url || urlError}
                                    </p>
                                )}
                            </div>

                            {/* Caption Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Caption
                                </label>
                                <textarea
                                    value={data.caption}
                                    onChange={(e) => setData('caption', e.target.value)}
                                    placeholder="Write a caption..."
                                    rows="6"
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                                />
                                <p className="text-gray-400 text-sm mt-2">
                                    {data.caption.length} / 2,200
                                </p>
                                {errors.caption && (
                                    <p className="text-red-500 text-sm mt-2">{errors.caption}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-auto">
                                <Link
                                    href={route('dashboard')}
                                    className="flex-1 px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || !imagePreview}
                                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Posting...' : 'Share'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Help Text */}
                    <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="font-semibold text-white mb-2">Tips for creating a great post:</h3>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>• Use a direct image URL (e.g., from Imgur, Cloudinary, or your own server)</li>
                            <li>• Your caption can be up to 2,200 characters</li>
                            <li>• You can edit or delete your post from your profile</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
