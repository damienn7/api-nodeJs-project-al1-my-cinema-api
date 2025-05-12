import { Request, Response } from 'express';
import { Cinema } from '../db/models/cinema';

export const updateCinema = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.capacity && (updates.capacity < 15 || updates.capacity > 30)) {
    res.status(400).json({ message: 'Capacity must be between 15 and 30.' });
    return
  }

  try {
    await Cinema.update({ id: Number(id) }, updates);
    const updated = await Cinema.findOneBy({ id: Number(id) });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cinema.' });
  }
};