import { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentCounter } from '../src/backend/clickCounter';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json(getCurrentCounter());
}
