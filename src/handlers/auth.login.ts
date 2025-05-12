import { Request, Response } from 'express';
import { User } from '../db/models/user';
import { Token } from '../db/models/token';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const login = async (req: Request, res: Response) : Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email et mot de passe requis.' });
    return
  }

  const user = await User.findOne({ where: { email }, relations: ['tokens'] });
  if (!user) {
    res.status(401).json({ message: 'Identifiants invalides.' });
    return
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ message: 'Mot de passe incorrect.' });
    return
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '5m',
  });

  const refreshToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

  const tokenEntry = Token.create({
    token,
    refreshToken,
    expiresAt,
    user,
  });
  await tokenEntry.save();

  res.status(200).json({
    accessToken: token,
    refreshToken: refreshToken,
  });
  return;
};
