import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { SeanceService } from '../../lib/services/seance.service';

// api/seances 
export default async function seancesHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const seanceService: SeanceService = new SeanceService();
    const method: String = req.method;
    const inputDataCreate:Array<Prisma.SeanceCreateManyInput> = req.body;
    const inputDataUpdate:Array<Prisma.SeanceUncheckedUpdateManyInput> = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await seanceService.getSeances();
        res.status(200).json(outputData);        
        break;
      case 'POST':
        outputData = await seanceService.addSeances(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await seanceService.setSeances(inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await seanceService.removeSeances(inputDataUpdate);
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
