import Chat from '@/models/Chat';
import connectDB from '@/DB/connectDB';

connectDB();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, otherUserId } = req.query;

    if (!userId || !otherUserId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const chat = await Chat.findOne({
      participants: {
        $all: [userId, otherUserId],
      },
    })
      .populate('participants', 'name email profilePic')
      .populate('messages.sender', 'name email profilePic')
      .select('-__v');

    if (!chat) {
      return res.status(200).json({
        success: true,
        chat: {
          participants: [userId, otherUserId],
          messages: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
