import { Prisma, Muscle } from '@prisma/client';
import prisma from '../prisma';

export interface IMuscleService {
  getMuscle(queryId: number): Promise<Muscle>;
  getMuscles(): Promise<Array<Muscle>>;
  addMuscle(inputData: Prisma.MuscleCreateInput): Promise<Muscle>;
  addMuscles(inputData: Array<Prisma.MuscleCreateManyInput>): Promise<Prisma.BatchPayload>;
  setMuscle(queryId: number, inputData: Prisma.MuscleUpdateInput): Promise<Muscle>;
  setMuscles(inputData: Array<Prisma.MuscleUncheckedUpdateInput>): Promise<Array<any>>;
  removeMuscle(queryId: number): Promise<Muscle>;
  removeMuscles(inputData: Array<Prisma.MuscleUncheckedUpdateInput>): Promise<Array<any>>;
}

export class MuscleService implements IMuscleService{
  public async getMuscle(queryId: number): Promise<Muscle> {
    return await prisma.muscle.findUnique({
      where: {id: queryId},
      include: {
        exercices: true
      }
    });
  }
  
  public async getMuscles(): Promise<Array<Muscle>> {
    return await prisma.muscle.findMany({
      // take: 10,
      include: {
        exercices: true
      }
    });
  }
  
  public async addMuscle(inputData: Prisma.MuscleCreateInput): Promise<Muscle> {
    return await prisma.muscle.create({
      data: inputData
    });
  }
  
  public async addMuscles(inputData: Array<Prisma.MuscleCreateManyInput>): Promise<Prisma.BatchPayload> {
    return await prisma.muscle.createMany({
      data: inputData,
      skipDuplicates: true,
    });
  }
  
  public async setMuscle(queryId: number, inputData: Prisma.MuscleUpdateInput): Promise<Muscle> {
    return prisma.muscle.update({
      where: {id: queryId},
      data:  {
        name: inputData.name,
        image: inputData.image
      }
    })
  }
  
  public async setMuscles(inputData: Array<Prisma.MuscleUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const muscle: Prisma.MuscleUncheckedUpdateInput = inputData[i] as Prisma.MuscleUncheckedUpdateInput;
      transactionsTab.push(
        prisma.muscle.update({
          where: {id: Number(muscle.id)},
          data:  {
            name: muscle.name,
            image: muscle.image
          }
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
  
  public async removeMuscle(queryId: number): Promise<Muscle> {
    return await prisma.muscle.delete({
      where: {id: queryId}
    })
  }
  
  public async removeMuscles(inputData: Array<Prisma.MuscleUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const muscle: Prisma.MuscleUncheckedUpdateInput = inputData[i] as Prisma.MuscleUncheckedUpdateInput;
      transactionsTab.push(
        prisma.muscle.delete({
          where: {id: Number(muscle.id)}
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
}
