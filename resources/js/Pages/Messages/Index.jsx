import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function MessagesIndex({ conversations }) {
    const { auth } = usePage().props;
    const [mode, setMode] = useState('discussions'); // 'discussions' or 'new'
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [loadingFollowers, setLoadingFollowers] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);

        // Fetch messages for this conversation
        try {
            const response = await window.axios.get(route('messages.show', conversation.id));
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleNewDiscussion = async () => {
        setLoadingFollowers(true);
        try {
            const response = await window.axios.get(route('followers.index'));
            setFollowers(response.data.followers);
            setMode('new');
        } catch (error) {
            console.error('Error fetching followers:', error);
        } finally {
            setLoadingFollowers(false);
        }
    };

    const handleStartConversation = async (follower) => {
        try {
            const response = await window.axios.post(route('conversations.create'), {
                user_id: follower.id,
            });

            if (response.data.conversation) {
                const newConversation = response.data.conversation;
                setSelectedConversation(newConversation);

                // Fetch messages for the new conversation
                try {
                    const messagesResponse = await window.axios.get(route('messages.show', newConversation.id));
                    setMessages(messagesResponse.data.messages);
                } catch (error) {
                    setMessages([]);
                }

                setMode('discussions');
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    const handleMessageSubmit = async () => {
        if (!messageText.trim() || !selectedConversation) return;

        try {
            setLoadingMessage(true);

            const response = await window.axios.post(
                route('messages.store', { conversation: selectedConversation.id }),
                {
                    content: messageText,
                }
            );

            if (response.status === 201) {
                const data = response.data;

                // Update messages
                setMessages((prevMessages) => [
                    ...(prevMessages || []),
                    data.message,
                ]);

                // Clear input
                setMessageText('');
            }
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
        } finally {
            setLoadingMessage(false);
        }
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (d.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Messages" />

            <div className="h-screen ml-28 bg-gray-900 flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-full lg:w-96 border-r border-gray-700 bg-gray-800 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-white">Messages</h1>
                        </div>

                        {/* Mode Toggle Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMode('discussions')}
                                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition ${
                                    mode === 'discussions'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                Discussions
                            </button>
                            <button
                                onClick={handleNewDiscussion}
                                disabled={loadingFollowers}
                                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition ${
                                    mode === 'new'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loadingFollowers ? 'Loading...' : 'New'}
                            </button>
                        </div>
                    </div>

                    {/* Conversations or Followers List */}
                    <div className="flex-1 overflow-y-auto">
                        {mode === 'discussions' ? (
                            conversations.data && conversations.data.length > 0 ? (
                            conversations.data.map((conversation) => {
                                const otherUser = conversation.user1_id === auth.user.id ? conversation.user2 : conversation.user1;
                                const lastMessage = conversation.messages && conversation.messages.length > 0 ? conversation.messages[0] : null;

                                return (
                                    <button
                                        key={conversation.id}
                                        onClick={() => handleSelectConversation(conversation)}
                                        className={`w-full flex items-center gap-3 p-4 border-b border-gray-700 transition cursor-pointer ${
                                            selectedConversation?.id === conversation.id
                                                ? 'bg-gray-700'
                                                : 'hover:bg-gray-700'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600 flex-shrink-0" />

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-white truncate">
                                                    {otherUser?.username || 'Unknown'}
                                                </p>
                                                {lastMessage && (
                                                    <p className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                                        {formatDate(lastMessage.created_at)}
                                                    </p>
                                                )}
                                            </div>
                                            {lastMessage && (
                                                <p className="text-sm text-gray-300 truncate">
                                                    {lastMessage.sender_id === auth.user.id ? 'You: ' : ''}{lastMessage.content}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="flex items-center justify-center h-full text-center p-4">
                                <p className="text-gray-400">No conversations yet</p>
                            </div>
                        )
                        ) : (
                            // Followers List
                            followers && followers.length > 0 ? (
                                followers.map((follower) => (
                                    <button
                                        key={follower.id}
                                        onClick={() => handleStartConversation(follower)}
                                        className="w-full flex items-center gap-3 p-4 border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer"
                                    >
                                        {/* Avatar */}
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600 flex-shrink-0" />

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate">
                                                {follower.username || 'Unknown'}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {follower.email}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full text-center p-4">
                                    <p className="text-gray-400">No followers yet</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Chat Area or Empty State */}
                <div className="hidden lg:flex flex-1 flex-col bg-gray-900">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="border-b border-gray-700 p-4 bg-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600" />
                                    <div>
                                        <p className="font-semibold text-white">
                                            {selectedConversation.user1_id === auth.user.id
                                                ? selectedConversation.user2?.username
                                                : selectedConversation.user1?.username}
                                        </p>
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
                                {messages && messages.length > 0 ? (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                                    message.sender_id === auth.user.id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-700 text-gray-100'
                                                }`}
                                            >
                                                <p className="text-sm break-words">{message.content}</p>
                                                <p
                                                    className={`text-xs mt-1 ${
                                                        message.sender_id === auth.user.id ? 'text-blue-100' : 'text-gray-400'
                                                    }`}
                                                >
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
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="h-16 w-16 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                                    <svg
                                        className="h-8 w-8 text-gray-500"
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
                                </div>
                                <p className="text-gray-400">Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
