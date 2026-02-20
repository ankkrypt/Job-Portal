import User from '@/models/User';
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

    // Get all users except the current user
    const users = await User.find({ _id: { $ne: userId } })
      .select('_id name email profilePic')
      .limit(50);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
