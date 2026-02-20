import pushersServer from '../pusher/config';
import Chat from '@/models/Chat';
import User from '@/models/User';
import connectDB from '@/DB/connectDB';

connectDB();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Find or create chat between two users
    let chat = await Chat.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        messages: [
          {
            sender: senderId,
            content: message,
            timestamp: new Date(),
          },
        ],
        lastMessage: message,
        lastMessageTime: new Date(),
      });
    } else {
      chat.messages.push({
        sender: senderId,
        content: message,
        timestamp: new Date(),
      });
      chat.lastMessage = message;
      chat.lastMessageTime = new Date();
    }

    await chat.save();

    // Get sender info for broadcast
    const sender = await User.findById(senderId).select('name email');

    // Trigger Pusher event
    const channelName = `presence-chat-${[senderId, receiverId].sort().join('-')}`;
    await pushersServer.trigger(channelName, 'new-message', {
      id: chat._id,
      senderId,
      senderName: sender?.name,
      content: message,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      chat,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
