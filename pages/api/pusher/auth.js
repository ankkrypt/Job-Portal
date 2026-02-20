import pusher from './config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { socket_id, channel_name, user_id, userName } = req.body;

    if (!socket_id || !channel_name || !user_id) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const presenceData = {
      user_id: user_id,
      user_info: {
        name: userName,
      },
    };

    const auth = pusher.authenticate(channel_name, socket_id, presenceData);
    return res.status(200).json(auth);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
