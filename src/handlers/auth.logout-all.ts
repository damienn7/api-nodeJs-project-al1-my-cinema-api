// src/controllers/auth/logoutAll.ts
import { Request, Response } from 'express';
import { Token } from '../db/models/token';
import { UserAuthRequest } from '../types/express';

export const logoutAll = async (req: UserAuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  
  const userId = req.user.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  try {
    await Token.delete({ user: { id: userId } });
    res.status(200).json({ message: 'All sessions terminated.' });
    return
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ message: 'Server error.' });
    return
  }
};
