import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { MuscleService } from '../../../lib/services/muscle.service';

// api/muscles/:id 
export default async function muscleHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const muscleService: MuscleService = new MuscleService();
    const method: String = req.method;
    const inputId: number = Number(req.query.id);
    const inputDataCreate: Prisma.MuscleCreateInput = req.body;
    const inputDataUpdate: Prisma.MuscleUpdateInput = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await muscleService.getMuscle(inputId);
        res.status(200).json(outputData);   
        break;
      case 'POST':
        outputData = await muscleService.addMuscle(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await muscleService.setMuscle(inputId, inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await muscleService.removeMuscle(inputId);
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
