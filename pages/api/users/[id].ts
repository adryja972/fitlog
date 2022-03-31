import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserService } from '../../../lib/services/user.service';

// api/users/:id 
export default async function userHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userService: UserService = new UserService();
    const method: String = req.method;
    const inputId: number = Number(req.query.id);
    const inputDataCreate: Prisma.UserCreateInput = req.body;
    const inputDataUpdate: Prisma.UserUpdateInput = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await userService.getUser(inputId);
        res.status(200).json(outputData);   
        break;
      case 'POST':
        outputData = await userService.addUser(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await userService.setUser(inputId, inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await userService.removeUser(inputId);
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
