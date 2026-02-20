import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from '@/components/NavBar';
import ChatBubble from '@/components/ChatBubble';
import ChatErrorBoundary from '@/components/ChatErrorBoundary';

export default function Chat() {
  const userData = useSelector(state => state.User.userData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user data is available
    if (userData) {
      setIsLoading(false);
    } else {
      // Wait a bit for redux to load, then redirect if still no user
      const timer = setTimeout(() => {
        if (!userData) {
          window.location.href = '/auth/login';
        } else {
          setIsLoading(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userData]);

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading chat...</p>
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <ChatErrorBoundary>
      <>
        <NavBar />
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-gray-900 mb-4">
                Messages & <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Chat</span>
              </h1>
              <p className="text-xl text-gray-600">Connect with other users in real-time</p>
            </div>

            {/* Chat Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8 text-center hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Real-time Chat</h3>
                <p className="text-gray-600">Connect instantly with other professionals</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8 text-center hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Live Notifications</h3>
                <p className="text-gray-600">Get instant alerts for new messages</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8 text-center hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your conversations are encrypted</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Chat</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">1</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Click Chat Icon</p>
                    <p className="text-gray-600 text-sm">Open the chat bubble at the bottom right corner</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold">2</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Select a Conversation</p>
                    <p className="text-gray-600 text-sm">Choose someone to chat with from your list</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">3</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Start Chatting</p>
                    <p className="text-gray-600 text-sm">Type your message and send it in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Bubble Component */}
        <ChatBubble currentUserId={userData?._id} userName={userData?.name} />
      </>
    </ChatErrorBoundary>
  );
}
