import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserService } from '../../lib/services/user.service';

// api/users 
export default async function usersHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userService: UserService = new UserService();
    const method: String = req.method;
    const inputDataCreate:Array<Prisma.UserCreateManyInput> = req.body;
    const inputDataUpdate:Array<Prisma.UserUncheckedUpdateManyInput> = req.body;
    let outputData: any;
    switch (method) {
      case 'GET':
        outputData = await userService.getUsers();
        res.status(200).json(outputData);        
        break;
      case 'POST':
        outputData = await userService.addUsers(inputDataCreate);
        res.status(200).json(outputData);
        break;
      case 'PUT':
        outputData = await userService.setUsers(inputDataUpdate);
        res.status(200).json(outputData);
        break;
      case 'DELETE':
        outputData = await userService.removeUsers(inputDataUpdate);
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
