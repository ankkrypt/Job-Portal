import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { getChatList, getMessages, sendMessage, getAllUsers } from '@/Services/chat';
import ChatWindow from './ChatWindow';

let PusherClient;
if (typeof window !== 'undefined') {
  PusherClient = require('pusher-js').default;
}

const ChatBubble = ({ currentUserId, userName }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pusher, setPusher] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'users'

  useEffect(() => {
    if (!currentUserId) return;

    try {
      // Initialize Pusher only if credentials are available
      if (process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
        const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
          authEndpoint: '/api/pusher/auth',
          auth: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        });

        setPusher(pusherClient);

        return () => {
          if (pusherClient) {
            pusherClient.disconnect();
          }
        };
      }
    } catch (err) {
      console.error('Pusher initialization error:', err);
      setError('Chat service unavailable. Please add Pusher credentials.');
    }
  }, [currentUserId]);

  useEffect(() => {
    if (showChat && currentUserId) {
      loadChatList();
    }
  }, [showChat, currentUserId]);

  useEffect(() => {
    if (!selectedChat || !pusher || !currentUserId) return;

    try {
      // Subscribe to chat channel
      const otherUser = selectedChat.participants.find(p => {
        const pId = typeof p === 'string' ? p : p._id;
        return pId !== currentUserId;
      });
      
      const otherUserId = typeof otherUser === 'string' ? otherUser : otherUser?._id;
      if (!otherUserId) return;

      const channelName = `presence-chat-${[currentUserId, otherUserId].sort().join('-')}`;

      const channel = pusher.subscribe(channelName);

      const handleNewMessage = (data) => {
        setMessages(prev => [
          ...prev,
          {
            sender: { _id: data.senderId, name: data.senderName },
            content: data.content,
            timestamp: data.timestamp,
          },
        ]);
      };

      channel.bind('new-message', handleNewMessage);

      return () => {
        if (channel) {
          channel.unbind('new-message', handleNewMessage);
          pusher.unsubscribe(channelName);
        }
      };
    } catch (err) {
      console.error('Channel subscription error:', err);
    }
  }, [selectedChat, pusher, currentUserId]);

  const loadChatList = async () => {
    if (!currentUserId) return;
    try {
      const result = await getChatList(currentUserId);
      if (result.success) {
        setChatList(result.chats || []);
        // If no chats, load available users
        if (!result.chats || result.chats.length === 0) {
          loadAvailableUsers();
          setActiveTab('users');
        }
      }
    } catch (err) {
      console.error('Error loading chat list:', err);
      setError('Failed to load chats');
    }
  };

  const loadAvailableUsers = async () => {
    if (!currentUserId) return;
    try {
      const result = await getAllUsers(currentUserId);
      if (result.success) {
        setAvailableUsers(result.users || []);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadMessages = async (chat) => {
    const otherUser = chat.participants.find(p => {
      const pId = typeof p === 'string' ? p : p._id;
      return pId !== currentUserId;
    });
    
    const otherUserId = typeof otherUser === 'string' ? otherUser : otherUser?._id;
    if (!otherUserId) return;
    
    try {
      const result = await getMessages(currentUserId, otherUserId);
      if (result.success) {
        setMessages(result.chat?.messages || []);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    loadMessages(chat);
  };

  const handleStartNewChat = async (user) => {
    // Create a temporary chat object to start a conversation
    const newChat = {
      _id: `${currentUserId}-${user._id}`,
      participants: [{ _id: currentUserId, name: userName }, user],
      messages: [],
      lastMessage: '',
    };
    setSelectedChat(newChat);
    setMessages([]);
    setActiveTab('messages');
  };

  const handleSendMessage = async (messageText) => {
    if (!selectedChat || !currentUserId) return;

    try {
      setIsLoading(true);
      const otherUser = selectedChat.participants.find(p => {
        const pId = typeof p === 'string' ? p : p._id;
        return pId !== currentUserId;
      });
      
      const otherUserId = typeof otherUser === 'string' ? otherUser : otherUser?._id;
      if (!otherUserId) return;

      // Add message to UI immediately (optimistic update)
      const optimisticMessage = {
        sender: { _id: currentUserId, name: userName },
        content: messageText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, optimisticMessage]);

      const result = await sendMessage(currentUserId, otherUserId, messageText);

      if (result.success) {
        // Reload messages to get fresh data from server
        await loadMessages(selectedChat);
        // Reload chat list to update last message
        await loadChatList();
      } else {
        setError(result.message || 'Failed to send message');
        // Remove the optimistic message if it failed
        setMessages(prev => prev.slice(0, -1));
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error sending message');
      setIsLoading(false);
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    setShowChat(false);
    setMessages([]);
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!showChat && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowChat(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-2xl transition-all flex items-center justify-center hover:scale-110"
          >
            <FiMessageCircle className="text-2xl" />
          </button>
        </div>
      )}

      {/* Chat List Sidebar */}
      {showChat && !selectedChat && (
        <div className="fixed bottom-20 right-6 w-full sm:w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
            <h2 className="font-bold text-white">Messages</h2>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            >
              <FiX className="text-white text-xl" />
            </button>
          </div>

          {/* Tabs */}
          {chatList.length > 0 && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 py-2 px-4 text-center font-semibold transition-all ${
                  activeTab === 'messages'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Chats ({chatList.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-2 px-4 text-center font-semibold transition-all ${
                  activeTab === 'users'
                    ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Users
              </button>
            </div>
          )}

          {/* Chat List */}
          {activeTab === 'messages' && (
            <div className="flex-1 overflow-y-auto">
              {chatList && chatList.length > 0 ? (
                chatList.map((chat) => {
                  const otherUser = chat.participants.find(p => p._id !== currentUserId);
                  return (
                    <button
                      key={chat._id}
                      onClick={() => handleSelectChat(chat)}
                      className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {otherUser?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{otherUser?.name}</p>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-center">No conversations yet</p>
                </div>
              )}
            </div>
          )}

          {/* Users List */}
          {activeTab === 'users' && (
            <div className="flex-1 overflow-y-auto">
              {availableUsers && availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleStartNewChat(user)}
                    className="w-full p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-center">No users available</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {showChat && selectedChat && (
        <ChatWindow
          chat={selectedChat}
          currentUserId={currentUserId}
          messages={messages}
          onSendMessage={handleSendMessage}
          onClose={handleCloseChat}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ChatBubble;
