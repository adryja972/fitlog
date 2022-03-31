import { Prisma, User } from '@prisma/client';
import prisma from '../prisma';

export interface IUserService {
  getUser(queryId: number): Promise<User>;
  getUsers(): Promise<Array<User>>;
  addUser(inputData: Prisma.UserCreateInput): Promise<User>;
  addUsers(inputData: Array<Prisma.UserCreateManyInput>): Promise<Prisma.BatchPayload>;
  setUser(queryId: number, inputData: Prisma.UserUpdateInput): Promise<User>;
  setUsers(inputData: Array<Prisma.UserUncheckedUpdateInput>): Promise<Array<any>>;
  removeUser(queryId: number): Promise<User>;
  removeUsers(inputData: Array<Prisma.UserUncheckedUpdateInput>): Promise<Array<any>>;
}

export class UserService implements IUserService{
  public async getUser(queryId: number): Promise<User> {
    return await prisma.user.findUnique({
      where: {id: queryId}
    });
  }
  
  public async getUsers(): Promise<Array<User>> {
    return await prisma.user.findMany({take: 10});
  }
  
  public async addUser(inputData: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data: inputData
    });
  }
  
  public async addUsers(inputData: Array<Prisma.UserCreateManyInput>): Promise<Prisma.BatchPayload> {
    return await prisma.user.createMany({
      data: inputData,
      skipDuplicates: true,
    });
  }
  
  public async setUser(queryId: number, inputData: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: {id: queryId},
      data:  {username: inputData.username, password: inputData.password}
    })
  }
  
  public async setUsers(inputData: Array<Prisma.UserUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const user: Prisma.UserUncheckedUpdateInput = inputData[i] as Prisma.UserUncheckedUpdateInput;
      transactionsTab.push(
        prisma.user.update({
          where: {id: Number(user.id)},
          data:  {username: user.username, password: user.password}
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
  
  public async removeUser(queryId: number): Promise<User> {
    return await prisma.user.delete({
      where: {id: queryId}
    })
  }
  
  public async removeUsers(inputData: Array<Prisma.UserUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const user: Prisma.UserUncheckedUpdateInput = inputData[i] as Prisma.UserUncheckedUpdateInput;
      transactionsTab.push(
        prisma.user.delete({
          where: {id: Number(user.id)}
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
}
