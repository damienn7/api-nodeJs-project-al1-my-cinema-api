import { Request, Response } from 'express';
import { User } from '../db/models/user';
import { UserAuthRequest } from '../types/express';

export const deleteMyAccount = async (req: UserAuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await User.delete({ id: userId });
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
