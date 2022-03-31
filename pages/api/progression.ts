import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ProgressionService } from '../../lib/services/progression.service';

// api/progressions 
export default async function progressionsHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const progressionService: ProgressionService = new ProgressionService();
    const method: String = req.method;
    const inputDataCreate:Array<Prisma.ProgressionCreateManyInput> = req.body;
    const inputDataUpdate:Array<Prisma.ProgressionUncheckedUpdateManyInput> = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await progressionService.getProgressions();
        res.status(200).json(outputData);        
        break;
      case 'POST':
        outputData = await progressionService.addProgressions(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await progressionService.setProgressions(inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await progressionService.removeProgressions(inputDataUpdate);
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
