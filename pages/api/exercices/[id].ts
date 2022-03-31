import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ExerciceService } from '../../../lib/services/exercice.service';

// api/exercices/:id 
export default async function exerciceHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const exerciceService: ExerciceService = new ExerciceService();
    const method: String = req.method;
    const inputId: number = Number(req.query.id);
    const inputDataCreate: Prisma.ExerciceCreateInput = req.body;
    const inputDataUpdate: Prisma.ExerciceUpdateInput = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await exerciceService.getExercice(inputId);
        res.status(200).json(outputData);   
        break;
      case 'POST':
        outputData = await exerciceService.addExercice(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await exerciceService.setExercice(inputId, inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await exerciceService.removeExercice(inputId);
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
