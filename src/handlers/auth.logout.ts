// src/controllers/auth/logout.ts
import { Request, Response } from 'express';
import { Token } from '../db/models/token';

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token required.' });
    return;
  }

  try {
    const token = await Token.findOne({ where: { refreshToken } });

    if (!token) {
      res.status(404).json({ message: 'Token not found.' });
      return;
    }

    await token.remove();
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
