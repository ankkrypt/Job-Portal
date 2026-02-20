import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const sendMessage = async (senderId, receiverId, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat/sendMessage`, {
      senderId,
      receiverId,
      message,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to send message',
    };
  }
};

export const getMessages = async (userId, otherUserId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/getMessages`, {
      params: { userId, otherUserId },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to fetch messages',
    };
  }
};

export const getChatList = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/getChatList`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to fetch chat list',
    };
  }
};

export const getAllUsers = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/getAllUsers`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to fetch users',
    };
  }
};
