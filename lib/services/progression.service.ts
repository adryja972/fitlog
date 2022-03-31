import { Prisma, Progression } from '@prisma/client';
import prisma from '../prisma';

export interface IProgressionService {
  getProgression(queryId: number): Promise<Progression>;
  getProgressions(): Promise<Array<Progression>>;
  addProgression(inputData: Prisma.ProgressionCreateInput): Promise<Progression>;
  addProgressions(inputData: Array<Prisma.ProgressionCreateManyInput>): Promise<Prisma.BatchPayload>;
  setProgression(queryId: number, inputData: Prisma.ProgressionUpdateInput): Promise<Progression>;
  setProgressions(inputData: Array<Prisma.ProgressionUncheckedUpdateInput>): Promise<Array<any>>;
  removeProgression(queryId: number): Promise<Progression>;
  removeProgressions(inputData: Array<Prisma.ProgressionUncheckedUpdateInput>): Promise<Array<any>>;
}

export class ProgressionService implements IProgressionService{
  public async getProgression(queryId: number): Promise<Progression> {
    return await prisma.progression.findUnique({
      where: {id: queryId},
      include: {
        exercice: true
      }
    });
  }
  
  public async getProgressions(): Promise<Array<Progression>> {
    return await prisma.progression.findMany({
      take: 10,
      include: {
        exercice: true
      }
    });
  }
  
  public async addProgression(inputData: Prisma.ProgressionCreateInput): Promise<Progression> {
    return await prisma.progression.create({
      data: inputData
    });
  }
  
  public async addProgressions(inputData: Array<Prisma.ProgressionCreateManyInput>): Promise<Prisma.BatchPayload> {
    return await prisma.progression.createMany({
      data: inputData,
      skipDuplicates: true,
    });
  }
  
  public async setProgression(queryId: number, inputData: Prisma.ProgressionUncheckedUpdateInput): Promise<Progression> {
    const exerciceId: Number = Number(inputData.exerciceId);
    const inputExercice: Prisma.ExerciceUncheckedUpdateInput = 
      await prisma.exercice.findUnique({
        where: {
          id: Number(exerciceId)
        }
      });    
    return prisma.progression.update({
      include: {exercice: true},
      where: {id: queryId},
      data:  {
        poids: inputData.poids,
        date: inputData.date,
        exercice: {
          connect: { 
            id: Number(inputExercice.id)
          }
        }
      }
    })
  }
  
  public async setProgressions(inputData: Array<Prisma.ProgressionUncheckedUpdateInput>): Promise<Array<Progression>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const progression: Prisma.ProgressionUncheckedUpdateInput = inputData[i] as Prisma.ProgressionUncheckedUpdateInput;
      const exerciceId: Number = Number(progression.exerciceId);
      const inputExercice: Prisma.ExerciceUncheckedUpdateInput = 
        await prisma.exercice.findUnique({
          where: {
            id: Number(exerciceId)
          }
        });
      transactionsTab.push(
        prisma.progression.update({
          include: {exercice: true},
          where: {id: Number(progression.id)},
          data:  {
            poids: progression.poids,
            date: progression.date,
            exercice: {
              connect: { 
                id: Number(inputExercice.id)
              }
            }
          }
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
  
  public async removeProgression(queryId: number): Promise<Progression> {
    return await prisma.progression.delete({
      where: {id: queryId}
    })
  }
  
  public async removeProgressions(inputData: Array<Prisma.ProgressionUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const progression: Prisma.ProgressionUncheckedUpdateInput = inputData[i] as Prisma.ProgressionUncheckedUpdateInput;
      transactionsTab.push(
        prisma.progression.delete({
          where: {id: Number(progression.id)}
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
}
