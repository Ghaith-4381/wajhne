import { VercelRequest, VercelResponse } from '@vercel/node';
import { incrementCounter } from '../src/backend/clickCounter';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { imageId } = req.body;

  if (![1, 2].includes(imageId)) {
    return res.status(400).json({ message: 'Invalid image ID' });
  }

  incrementCounter(imageId);
  return res.status(200).json({ message: 'Click registered' });
}
