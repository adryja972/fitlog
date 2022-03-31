import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ProgrammeService } from '../../lib/services/programme.service';

interface CustomProgrammeUpdateInput extends Prisma.ProgrammeUpdateInput {
  queryId: number; 
}

// api/programmes 
export default async function programmesHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const programmeService: ProgrammeService = new ProgrammeService();
    const method: String = req.method;
    const inputDataCreate:Array<Prisma.ProgrammeCreateManyInput> = req.body;
    const inputDataUpdate:Array<CustomProgrammeUpdateInput> = req.body;
    // const inputDataUpdate:Array<Prisma.ProgrammeUncheckedUpdateManyInput> = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await programmeService.getProgrammes();
        res.status(200).json(outputData);        
        break;
      case 'POST':
        outputData = await programmeService.addProgrammes(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await programmeService.setProgrammes(inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await programmeService.removeProgrammes(inputDataUpdate);
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
