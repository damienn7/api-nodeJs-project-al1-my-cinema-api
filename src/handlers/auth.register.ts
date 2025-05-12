// src/controllers/auth/register.ts
import { Request, Response } from 'express';
import { User } from '../db/models/user';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) : Promise <void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User.create({
      email,
      password: hashedPassword,
      tokens: [],
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful.' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
    return
  }
};
