import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { SeanceService } from '../../../lib/services/seance.service';

// api/seances/:id 
export default async function seanceHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const seanceService: SeanceService = new SeanceService();
    const method: String = req.method;
    const inputId: number = Number(req.query.id);
    const inputDataCreate: Prisma.SeanceCreateInput = req.body;
    const inputDataUpdate: Prisma.SeanceUpdateInput = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await seanceService.getSeance(inputId);
        res.status(200).json(outputData);   
        break;
      case 'POST':
        outputData = await seanceService.addSeance(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await seanceService.setSeance(inputId, inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await seanceService.removeSeance(inputId);
        res.status(200).json(outputData);
      break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.log(error);
  }
}
