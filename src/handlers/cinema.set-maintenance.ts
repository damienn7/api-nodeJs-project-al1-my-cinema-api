import { Request, Response } from 'express';
import { Cinema } from '../db/models/cinema';

export const setMaintenance = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Cinema.update({ id: Number(id) }, { status: 'MAINTENANCE' });
    res.status(200).json({ message: 'Cinema set to maintenance.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cinema status.' });
  }
};