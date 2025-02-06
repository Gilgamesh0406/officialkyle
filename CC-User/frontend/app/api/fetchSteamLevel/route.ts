import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const steamId = (session.user as any).steamId;
  const apiKey = process.env.STEAM_API_KEY;

  try {
    const response = await axios.get(
      `${process.env.STEAM_LEVEL_URL}/key=${apiKey}&steamid=${steamId}`
    );
    const steamLevel = response.data.response.player_level;

    return res.status(200).json({ steamLevel });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch Steam level' });
  }
};

export default handler;
