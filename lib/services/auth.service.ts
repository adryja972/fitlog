import { PrismaClient } from "@prisma/client";
import { IronSessionData } from "iron-session";
export interface IAuthService {
  login(username : string, password : string): Promise<IronSessionData>;
}

export class AuthService implements IAuthService{
  public async login(username : string, password : string): Promise<IronSessionData> {
    const prisma = new PrismaClient();
    const user = await prisma.user.findMany({
      where: {
        username: username,
        password: password
      },
      select: {
        id: true,
        username: true,
        password: true
      },
      take: 1
    });
    if (!user[0]) {
      throw Error('User not registered');
    }    
    // const bcrypt = require('bcrypt');
    // const checkPassword = bcrypt.compareSync(password, user[0].password);
    // if (!checkPassword) throw Error('Password not valid');
    delete user[0].password;
    return {
      id: String(user[0].id),
      username: user[0].username
    } as IronSessionData
  }

  public async signin(username : string, password : string, confirmPassword : string): Promise<IronSessionData> {
    
    // const bcrypt = require('bcrypt');
    // const checkPassword = bcrypt.compareSync(password, user[0].password);
    // if (!checkPassword) throw Error('Password not valid');

    if (password.localeCompare(confirmPassword) != 0) {
      throw Error('Password not valid');
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password
      },
      select: {
        id: true,
        username: true,
        password: true
      }
    });

    if (!user) {
      throw Error('Error when creating User');
    }    

    delete user.password;

    return {
      id: String(user.id),
      username: user.username
    } as IronSessionData
  }
}
