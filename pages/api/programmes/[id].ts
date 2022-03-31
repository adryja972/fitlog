import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ProgrammeService } from '../../../lib/services/programme.service';

// api/programmes/:id 
export default async function programmeHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const programmeService: ProgrammeService = new ProgrammeService();
    const method: String = req.method;
    const inputId: number = Number(req.query.id);
    const inputDataCreate: Prisma.ProgrammeCreateInput = req.body;
    const inputDataUpdate: Prisma.ProgrammeUpdateInput = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await programmeService.getProgramme(inputId);
        res.status(200).json(outputData);   
        break;
      case 'POST':
        outputData = await programmeService.addProgramme(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await programmeService.setProgramme(inputId, inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await programmeService.removeProgramme(inputId);
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
