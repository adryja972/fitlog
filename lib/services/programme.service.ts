import { Prisma, Programme } from '@prisma/client';
import prisma from '../prisma';

interface CustomProgrammeUpdateInput extends Prisma.ProgrammeUpdateInput {
  queryId: number; 
}

export interface IProgrammeService {
  getProgramme(queryId: number): Promise<Programme>;
  getProgrammes(): Promise<Array<Programme>>;
  addProgramme(inputData: Prisma.ProgrammeCreateInput): Promise<Programme>;
  addProgrammes(inputData: Array<Prisma.ProgrammeCreateManyInput>): Promise<Prisma.BatchPayload>;
  setProgramme(queryId: number, inputData: Prisma.ProgrammeUpdateInput): Promise<Programme>;
  setProgrammes(inputData: Array<Prisma.ProgrammeUncheckedUpdateInput>): Promise<Array<any>>;
  removeProgramme(queryId: number): Promise<Programme>;
  removeProgrammes(inputData: Array<Prisma.ProgrammeUncheckedUpdateInput>): Promise<Array<any>>;
}

export class ProgrammeService implements IProgrammeService{
  public async getProgramme(queryId: number): Promise<Programme> {
    return await prisma.programme.findUnique({
      where: {id: queryId},
      include: {
        exercices: true
      }
    });
  }
  
  public async getProgrammes(): Promise<Array<Programme>> {
    return await prisma.programme.findMany({
      take: 10,
      include: {
        exercices: true
      }
    });
  }
  
  public async addProgramme(inputData: Prisma.ProgrammeCreateInput): Promise<Programme> {
    return await prisma.programme.create({
      data: inputData
    });
  }
  
  public async addProgrammes(inputData: Array<Prisma.ProgrammeCreateManyInput>): Promise<Prisma.BatchPayload> {
    return await prisma.programme.createMany({
      data: inputData,
      skipDuplicates: true,
    });
  }
  
  public async setProgramme(queryId: number, inputData: Prisma.ProgrammeUpdateInput): Promise<Programme> {
    const inputExercices: Array<Prisma.ExerciceUncheckedUpdateInput> = inputData.exercices as Array<Prisma.ExerciceUncheckedUpdateInput>
    return prisma.programme.update({
      include: {exercices: true},
      where: {id: queryId},
      data:  {
        name: inputData.name,
        image: inputData.image,
        exercices: {
          connectOrCreate: inputExercices.map((inputExercice) => {
            return {
              where: {
                id: inputExercice.id
              },
              create: {
                name: inputExercice.name,
                image: inputExercice.image,
              }
            } as Prisma.ExerciceCreateOrConnectWithoutMusclesInput
          })
        }
      }
    })
  }
  
  public async setProgrammes(inputData: Array<CustomProgrammeUpdateInput>): Promise<Array<Programme>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const programme: CustomProgrammeUpdateInput = inputData[i] as CustomProgrammeUpdateInput;
      const inputExercices: Array<Prisma.ExerciceUncheckedUpdateInput> = programme.exercices as Array<Prisma.ExerciceUncheckedUpdateInput>
      transactionsTab.push(
        prisma.programme.update({
          include: {exercices: true},
          where: {id: Number(programme.queryId)},
          data:  {
            name: programme.name,
            exercices: {
              connectOrCreate: inputExercices.map((exercice) => {
                return {
                  where: {
                    id: exercice.id
                  },
                  create: {
                    name: exercice.name,
                    image: exercice.image,
                  }
                } as Prisma.ExerciceCreateOrConnectWithoutMusclesInput
              })
            }
          }
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
  
  public async removeProgramme(queryId: number): Promise<Programme> {
    return await prisma.programme.delete({
      where: {id: queryId}
    })
  }
  
  public async removeProgrammes(inputData: Array<Prisma.ProgrammeUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const programme: Prisma.ProgrammeUncheckedUpdateInput = inputData[i] as Prisma.ProgrammeUncheckedUpdateInput;
      transactionsTab.push(
        prisma.programme.delete({
          where: {id: Number(programme.id)}
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
}
