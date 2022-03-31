import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ExerciceService, ExerciceWithMuscles } from '../../lib/services/exercice.service';

interface CustomExerciceUpdateInput extends Prisma.ExerciceUpdateInput {
  queryId: number; 
}

// api/exercices 
export default async function exercicesHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const exerciceService: ExerciceService = new ExerciceService();
    const method: String = req.method;
    const inputDataCreate:Prisma.ExerciceCreateInput = req.body;
    // const inputDataCreate:Array<ExerciceWithMuscles> = req.body;
    // const inputDataCreate:Array<Prisma.ExerciceCreateManyInput> = req.body;
    const inputDataUpdate:Array<CustomExerciceUpdateInput> = req.body;
    // const inputDataUpdate:Array<Prisma.ExerciceUncheckedUpdateManyInput> = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await exerciceService.getExercices();
        res.status(200).json(outputData);        
        break;
      case 'POST':
        // outputData = await exerciceService.addExercices(inputDataCreate);
        outputData = await exerciceService.addExercice(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await exerciceService.setExercices(inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await exerciceService.removeExercices(inputDataUpdate);
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
