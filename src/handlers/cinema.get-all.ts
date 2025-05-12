import { Request, Response } from 'express';
import { Cinema } from '../db/models/cinema';

export const getCinemas = async (_: Request, res: Response) => {
  try {
    const cinemas = await Cinema.find();
    res.status(200).json(cinemas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cinemas.' });
  }
};