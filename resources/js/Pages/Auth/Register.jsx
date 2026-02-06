import InputError from '@/Components/InputError';
import AuthInput from '@/Components/AuthInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <Head title="Sign up" />

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

                {/* Tagline */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-400">
                        Sign up to see photos and videos from your friends.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <AuthInput
                            id="username"
                            type="text"
                            label="Username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            autoComplete="username"
                            autoFocus
                        />
                        <InputError message={errors.username} className="mt-2" />
                    </div>

                    <div>
                        <AuthInput
                            id="email"
                            type="email"
                            label="Email address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <AuthInput
                            id="password"
                            type="password"
                            label="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <AuthInput
                            id="password_confirmation"
                            type="password"
                            label="Confirm password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            autoComplete="new-password"
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-600" />
                    <span className="px-4 text-sm text-gray-400">OR</span>
                    <div className="flex-1 border-t border-gray-600" />
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-gray-800 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg">
                            <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path>
                            <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path>
                            <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path>
                            <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path>
                        </svg>
                        Sign up with Google
                    </button>

                    <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-gray-800 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                        <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Sign up with Facebook
                    </button>
                </div>

                {/* Login Link */}
                <div className="mt-8 border-t border-gray-600 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-blue-400 transition hover:text-blue-300"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
