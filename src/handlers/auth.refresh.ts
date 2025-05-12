// src/controllers/auth/refresh.ts
import { Request, Response } from 'express';
import { Token } from '../db/models/token';
import jwt from 'jsonwebtoken';

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token is required.' });
    return;
  }

  try {
    const tokenEntry = await Token.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!tokenEntry) {
      res.status(403).json({ message: 'Invalid refresh token.' });
      return;
    }

    if (tokenEntry.expiresAt < new Date()) {
      await tokenEntry.remove();
      res.status(403).json({ message: 'Refresh token has expired.' });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: tokenEntry.user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '5m' }
    );

    tokenEntry.token = newAccessToken;
    await tokenEntry.save();

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
