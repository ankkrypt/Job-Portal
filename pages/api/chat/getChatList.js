import Chat from '@/models/Chat';
import connectDB from '@/DB/connectDB';

connectDB();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const chats = await Chat.find({
      participants: userId,
    })
      .populate('participants', 'name email profilePic')
      .sort({ lastMessageTime: -1 })
      .select('-messages');

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
