import { Request, Response } from 'express';
import { Cinema } from '../db/models/cinema';

export const deleteCinema = async (req: Request, res: Response) => {
  try {
    await Cinema.delete({ id: Number(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cinema.' });
  }
};