import { Request, Response } from 'express';
import { Session } from '../db/models/session';
import { Between } from 'typeorm';

export const getCinemaSchedule = async (req: Request, res: Response) : Promise<void> => {
  const cinemaId = Number(req.params.id);
  const { start, end } = req.query;

  if (!start || !end) {
    res.status(400).json({ message: 'Start and end date required' });
    return
  }

  try {
    const sessions = await Session.find({
      where: {
        cinema: { id: cinemaId },
        startsAt: Between(new Date(start as string), new Date(end as string))
      },
      relations: ['movie']
    });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule.' });
  }
};