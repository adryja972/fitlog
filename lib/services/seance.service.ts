import { Prisma, Seance } from '@prisma/client';
import prisma from '../prisma';

export interface ISeanceService {
  getSeance(queryId: number): Promise<Seance>;
  getSeances(): Promise<any>;
  addSeance(inputData: Prisma.SeanceCreateInput): Promise<Seance>;
  addSeances(inputData: Array<Prisma.SeanceCreateManyInput>): Promise<Prisma.BatchPayload>;
  setSeance(queryId: number, inputData: Prisma.SeanceUpdateInput): Promise<Seance>;
  setSeances(inputData: Array<Prisma.SeanceUncheckedUpdateInput>): Promise<Array<any>>;
  removeSeance(queryId: number): Promise<Seance>;
  removeSeances(inputData: Array<Prisma.SeanceUncheckedUpdateInput>): Promise<Array<any>>;
}

export class SeanceService implements ISeanceService{
  public async getSeance(queryId: number): Promise<Seance> {
    return await prisma.seance.findUnique({
      where: {id: queryId},
      include: {
        programme: true
      }
    });
  }
  
  public async getSeances(): Promise<any> {
    return await prisma.seance.findMany({
      take: 9,
      where: { done: "true"},
      include: {
        programme: true
      },
      orderBy: {
        id: 'desc',
      }
    });
  }
  
  public async addSeance(inputData: Prisma.SeanceCreateInput): Promise<Seance> {
    return await prisma.seance.create({
      data: inputData
    });
  }
  
  public async addSeances(inputData: Array<Prisma.SeanceCreateManyInput>): Promise<Prisma.BatchPayload> {
    return await prisma.seance.createMany({
      data: inputData,
      skipDuplicates: true,
    });
  }
  
  public async setSeance(queryId: number, inputData: Prisma.SeanceUncheckedUpdateInput): Promise<Seance> {
    const programmeId: Number = Number(inputData.programmeId);
    const inputProgramme: Prisma.ProgrammeUncheckedUpdateInput = 
      await prisma.programme.findUnique({
        where: {
          id: Number(programmeId)
        }
      });    
    return prisma.seance.update({
      include: {programme: true},
      where: {id: queryId},
      data:  {
        date: inputData.date,
        done: inputData.done,
        programme: {
          connectOrCreate: { 
            where: {id: Number(inputProgramme.id)},
            create: {name: String(inputProgramme.name), image: ""}
          }
        }
      }
    })
  }
  
  public async setSeances(inputData: Array<Prisma.SeanceUncheckedUpdateInput>): Promise<Array<Seance>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const seance: Prisma.SeanceUncheckedUpdateInput = inputData[i] as Prisma.SeanceUncheckedUpdateInput;
      const programmeId: Number = Number(seance.programmeId);
      const inputProgramme: Prisma.ProgrammeUncheckedUpdateInput = 
        await prisma.programme.findUnique({
          where: {
            id: Number(programmeId)
          }
        });
      transactionsTab.push(
        prisma.seance.update({
          include: {programme: true},
          where: {id: Number(seance.id)},
          data:  {
            date: seance.date,
            done: seance.done,
            programme: {
              connectOrCreate: { 
                where: {id: Number(inputProgramme.id)},
                create: {name: String(inputProgramme.name), image: ""}
              }
            }
          }
        })
      );
    }
    console.log(transactionsTab);
    return await prisma.$transaction(transactionsTab);
  }
  
  public async removeSeance(queryId: number): Promise<Seance> {
    return await prisma.seance.delete({
      where: {id: queryId}
    })
  }
  
  public async removeSeances(inputData: Array<Prisma.SeanceUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const seance: Prisma.SeanceUncheckedUpdateInput = inputData[i] as Prisma.SeanceUncheckedUpdateInput;
      transactionsTab.push(
        prisma.seance.delete({
          where: {id: Number(seance.id)}
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
}
