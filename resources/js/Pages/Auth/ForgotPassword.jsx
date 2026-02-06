import InputError from '@/Components/InputError';
import AuthInput from '@/Components/AuthInput';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <Head title="Forgot Password" />

            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-6 inline-block">
                        <svg
                            className="h-16 w-16"
                            fill="url(#instagram-gradient)"
                            viewBox="0 0 24 24"
                        >
                            <defs>
                                <linearGradient
                                    id="instagram-gradient"
                                    x1="0%"
                                    y1="100%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop
                                        offset="0%"
                                        style={{
                                            stopColor: '#feda75',
                                            stopOpacity: 1,
                                        }}
                                    />
                                    <stop
                                        offset="5%"
                                        style={{
                                            stopColor: '#fa7e1e',
                                            stopOpacity: 1,
                                        }}
                                    />
                                    <stop
                                        offset="45%"
                                        style={{
                                            stopColor: '#d92e7f',
                                            stopOpacity: 1,
                                        }}
                                    />
                                    <stop
                                        offset="60%"
                                        style={{
                                            stopColor: '#9b36b7',
                                            stopOpacity: 1,
                                        }}
                                    />
                                    <stop
                                        offset="90%"
                                        style={{
                                            stopColor: '#515bd4',
                                            stopOpacity: 1,
                                        }}
                                    />
                                </linearGradient>
                            </defs>
                            <circle cx="12" cy="12" r="10" />
                            <path
                                d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                                fill="white"
                            />
                            <circle cx="16.5" cy="7.5" r="1" fill="white" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-light tracking-wider text-white">
                        INSTAGRAM
                    </h1>
                </div>

                {/* Recovery Message */}
                <div className="mb-6 rounded-lg border border-gray-600 bg-gray-800 p-4 text-center">
                    <p className="text-sm text-gray-300">
                        Trouble logging in?
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                        Enter your email address and we'll send you a link to get back into your account.
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-4 rounded-md bg-green-500/20 p-3 text-sm text-green-200">
                        {status}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <AuthInput
                            id="email"
                            type="email"
                            label="Email address or username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoFocus
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Sending...' : 'Send login link'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-600" />
                    <span className="px-4 text-sm text-gray-400">OR</span>
                    <div className="flex-1 border-t border-gray-600" />
                </div>

                {/* Action Links */}
                <div className="space-y-3 text-center">
                    <div>
                        <Link
                            href={route('register')}
                            className="text-sm text-blue-400 transition hover:text-blue-300"
                        >
                            Create new account
                        </Link>
                    </div>
                    <div>
                        <Link
                            href={route('login')}
                            className="text-sm text-blue-400 transition hover:text-blue-300"
                        >
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
