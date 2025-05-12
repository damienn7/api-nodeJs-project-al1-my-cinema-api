import { Request, Response } from 'express';
import { Cinema } from '../db/models/cinema';

export const createCinema = async (req: Request, res: Response): Promise<void> => {
  const { name, description, image, type, capacity, isAccessible } = req.body;

  if (capacity < 15 || capacity > 30) {
    res.status(400).json({ message: 'Capacity must be between 15 and 30.' });
    return
  }

  try {
    const cinema = Cinema.create({ name, description, image, type, capacity, isAccessible });
    await cinema.save();
    res.status(201).json(cinema);
  } catch (error) {
    res.status(500).json({ message: 'Error creating cinema.' });
  }
};