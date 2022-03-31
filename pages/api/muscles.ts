import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { MuscleService } from '../../lib/services/muscle.service';

// api/muscles 
export default async function musclesHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const muscleService: MuscleService = new MuscleService();
    const method: String = req.method;
    const inputDataCreate:Array<Prisma.MuscleCreateManyInput> = req.body;
    const inputDataUpdate:Array<Prisma.MuscleUncheckedUpdateManyInput> = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await muscleService.getMuscles();
        res.status(200).json(outputData);        
        break;
      case 'POST':
        outputData = await muscleService.addMuscles(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await muscleService.setMuscles(inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await muscleService.removeMuscles(inputDataUpdate);
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
