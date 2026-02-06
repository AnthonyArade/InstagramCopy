import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function MessagesShow({ conversation, otherUser, messages: initialMessages }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [messageText, setMessageText] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessageSubmit = async () => {
        if (!messageText.trim()) return;

        try {
            setLoadingMessage(true);

            const response = await window.axios.post(
                route('messages.store', { conversation: conversation.id }),
                {
                    content: messageText,
                }
            );

            if (response.status === 201) {
                const data = response.data;

                // Update messages
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    data: [...(prevMessages.data || []), data.message],
                }));

                // Clear input
                setMessageText('');
            }
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
        } finally {
            setLoadingMessage(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Chat with ${otherUser?.username}`} />

            <div className="min-h-screen ml-28 bg-gray-900 flex">
                {/* Back link on mobile */}
                <div className="hidden lg:flex flex-col w-96 border-r border-gray-700 bg-gray-800">
                    <div className="p-4 border-b border-gray-700">
                        <Link href={route('messages.index')} className="text-gray-400 hover:text-white">
                            ← Back to Messages
                        </Link>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-700 p-4 bg-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600" />
                            <div>
                                <p className="font-semibold text-white">{otherUser?.username}</p>
                                <p className="text-xs text-gray-400">Active</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages && messages.data && messages.data.length > 0 ? (
                            messages.data.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            message.sender_id === auth.user.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-100'
                                        }`}
                                    >
                                        <p className="text-sm break-words">{message.content}</p>
                                        <p className={`text-xs mt-1 ${message.sender_id === auth.user.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(message.created_at).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400">No messages yet. Start the conversation!</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-700 p-4 bg-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleMessageSubmit();
                                    }
                                }}
                                className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleMessageSubmit}
                                disabled={loadingMessage || !messageText.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition"
                            >
                                {loadingMessage ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
