import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ProgressionService } from '../../../lib/services/progression.service';

// api/progressions/:id 
export default async function progressionHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const progressionService: ProgressionService = new ProgressionService();
    const method: String = req.method;
    const inputId: number = Number(req.query.id);
    const inputDataCreate: Prisma.ProgressionCreateInput = req.body;
    const inputDataUpdate: Prisma.ProgressionUpdateInput = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await progressionService.getProgression(inputId);
        res.status(200).json(outputData);   
        break;
      case 'POST':
        outputData = await progressionService.addProgression(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await progressionService.setProgression(inputId, inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await progressionService.removeProgression(inputId);
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
