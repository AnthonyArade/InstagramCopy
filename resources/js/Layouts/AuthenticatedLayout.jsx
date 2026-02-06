import InstagramLogo from '@/Components/InstagramLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="flex min-h-screen bg-white">
            {/* Vertical Sidebar */}
            <nav className="fixed left-0 top-0 h-screen border-r border-gray-700 bg-gray-900 p-6 flex flex-col">
                {/* Logo */}
                <div>
                    <Link href="/" className="mb-12 flex justify-center">
                        <InstagramLogo className="h-12 w-12" />
                    </Link>
                </div>
                {/* Main Navigation - Center */}
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    {/* Home */}
                    <Link
                        href={route('dashboard')}
                        className={`flex items-center gap-4 rounded-lg px-4 py-3 transition ${route().current('dashboard')
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                    </Link>

                    {/* Messages */}
                    <Link
                        href={route('messages.index')}
                        className={`flex items-center gap-4 rounded-lg px-4 py-3 transition ${
                            route().current('messages.*')
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                    </Link>

                    {/* Create Post */}
                    <Link
                        href={route('posts.create')}
                        className="flex items-center gap-4 rounded-lg px-4 py-3 text-gray-400 transition hover:text-white"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                    </Link>

                    {/* Notifications */}
                    <Link
                        href="#"
                        className="flex items-center gap-4 rounded-lg px-4 py-3 text-gray-400 transition hover:text-white"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                        </svg>
                    </Link>
                </div>

                {/* Profile - Bottom */}
                <div className="border-t border-gray-700 pt-6">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-gray-400 transition hover:text-white">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-red-500" />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="left">
                            <Dropdown.Link href={route('users.profile', user.id)}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link href={route('profile.edit')}>
                                Settings
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 min-h-screen bg-white">{children}</main>
        </div>
    );
}
