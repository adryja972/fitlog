import { Prisma, Exercice } from '@prisma/client';
import prisma from '../prisma';

interface CustomExerciceUpdateInput extends Prisma.ExerciceUpdateInput {
  queryId: number; 
}

const exerciceWithMuscles = Prisma.validator<Prisma.ExerciceArgs>()({
  include: { muscles: true },
})

export type ExerciceWithMuscles = Prisma.ExerciceGetPayload<typeof exerciceWithMuscles>


export interface IExerciceService {
  getExercice(queryId: number): Promise<ExerciceWithMuscles>;
  getExercices(): Promise<Array<ExerciceWithMuscles>>;
  
  // addExercice(inputData: ExerciceWithMuscles): Promise<any>;
  // addExercices(inputData: Array<ExerciceWithMuscles>): Promise<Prisma.BatchPayload>;
  addExercice(inputData: Prisma.ExerciceCreateInput): Promise<Exercice>;
  addExercices(inputData: Array<Prisma.ExerciceCreateManyInput>): Promise<Prisma.BatchPayload>;

  setExercice(queryId: number, inputData: Prisma.ExerciceUpdateInput): Promise<Exercice>;
  setExercices(inputData: Array<Prisma.ExerciceUncheckedUpdateInput>): Promise<Array<any>>;
  removeExercice(queryId: number): Promise<Exercice>;
  removeExercices(inputData: Array<Prisma.ExerciceUncheckedUpdateInput>): Promise<Array<any>>;
}

export class ExerciceService implements IExerciceService{
  public async getExercice(queryId: number): Promise<ExerciceWithMuscles> {
    return await prisma.exercice.findUnique({
      where: {id: queryId},
      include: { muscles: true }
    });
  }
  
  public async getExercices(): Promise<Array<ExerciceWithMuscles>> {
    return await prisma.exercice.findMany({
      // take: 10,
      include: { muscles: true }
    });
  }
  
  // public async addExercice(inputData: ExerciceWithMuscles): Promise<any> {
  public async addExercice(inputData: Prisma.ExerciceCreateInput): Promise<Exercice> {
    return await prisma.exercice.create({
      data: {
        name: inputData.name,
        image: inputData.image,
        muscles: inputData.muscles
      }
      
    });
  }
  
  // public async addExercices(inputData: Array<ExerciceWithMuscles>): Promise<Prisma.BatchPayload> {
  public async addExercices(inputData: Array<Prisma.ExerciceCreateManyInput>): Promise<Prisma.BatchPayload> {
    return await prisma.exercice.createMany({
      data: inputData,
      skipDuplicates: true,
    });
  }

  public async setExercice(queryId: number, inputData: Prisma.ExerciceUpdateInput): Promise<Exercice> {
    if (inputData.muscles == undefined) {
      return prisma.exercice.update({
        include: {muscles: true},
        where: {id: queryId},
        data:  {
          name: inputData.name,
          image: inputData.image
        }
      })
    } else {
      const inputMuscles: Array<Prisma.MuscleUncheckedUpdateInput> = inputData.muscles as Array<Prisma.MuscleUncheckedUpdateInput>
      return prisma.exercice.update({
        include: {muscles: true},
        where: {id: queryId},
        data:  {
          name: inputData.name,
          image: inputData.image,
          muscles: inputData.muscles
          // {
            // connectOrCreate: inputMuscles.map((muscle) => {
            //   return {
            //     where: {
            //       id: muscle.id
            //     },
            //     create: {
            //       name: muscle.name,
            //       image: muscle.image,
            //     }
            //   } as Prisma.MuscleCreateOrConnectWithoutExercicesInput
            // })
          // }
        }
      })
    }

  }
  
  public async setExercices(inputData: Array<CustomExerciceUpdateInput>): Promise<Array<Exercice>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const exercice: CustomExerciceUpdateInput = inputData[i] as CustomExerciceUpdateInput;
      const inputMuscles: Array<Prisma.MuscleUncheckedUpdateWithoutExercicesInput> = exercice.muscles as Array<Prisma.MuscleUncheckedUpdateWithoutExercicesInput>
      transactionsTab.push(
        prisma.exercice.update({
          include: {muscles: true},
          where: {id: Number(exercice.queryId)},
          data:  {
            name: exercice.name,
            image: exercice.image,
            muscles: {
              connectOrCreate: inputMuscles.map((muscle) => {
                return {
                  where: {
                    id: muscle.id
                  },
                  create: {
                    name: muscle.name,
                    image: muscle.image,
                  }
                } as Prisma.MuscleCreateOrConnectWithoutExercicesInput
              })
            }
          }
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
  
  public async removeExercice(queryId: number): Promise<Exercice> {
    return await prisma.exercice.delete({
      where: {id: queryId}
    })
  }
  
  public async removeExercices(inputData: Array<Prisma.ExerciceUncheckedUpdateInput>): Promise<Array<any>> {
    let transactionsTab: Array<any> = [];
    for (let i = 0; i < inputData.length; i++) {
      const exercice: Prisma.ExerciceUncheckedUpdateInput = inputData[i] as Prisma.ExerciceUncheckedUpdateInput;
      transactionsTab.push(
        prisma.exercice.delete({
          where: {id: Number(exercice.id)}
        })
      );
    }
    return await prisma.$transaction(transactionsTab);
  }
}


  // public async setExercice(queryId: number, inputData: Prisma.ExerciceUpdateInput): Promise<Exercice> {
  //   const inputMuscles: Array<Prisma.MuscleUncheckedUpdateInput> = inputData.muscles as Array<Prisma.MuscleUncheckedUpdateInput>
  //   return prisma.exercice.update({
  //     include: {muscles: true},
  //     where: {id: queryId},
  //     data:  {
  //       name: inputData.name,
  //       image: inputData.image,
  //       muscles: {
  //         connectOrCreate: inputMuscles.map((muscle) => {
  //           return {
  //             where: {muscleId_exerciceId: {muscleId: muscle.id, exerciceId: queryId}},
  //             create: {
  //               muscle: {
  //                 connectOrCreate: {
  //                   create: {name: muscle.name},
  //                   where: {id: muscle.id}
  //                 },
  //               }
  //             }
  //           } as Prisma.ExercicesMusclesCreateOrConnectWithoutExerciceInput
  //         })
  //       }
  //     }
  //   })
  // }
  
  // public async setExercices(inputData: Array<Prisma.ExerciceUncheckedUpdateInput>): Promise<Array<Exercice>> {
  //   let transactionsTab: Array<any> = [];
  //   for (let i = 0; i < inputData.length; i++) {
  //     const exercice: Prisma.ExerciceUncheckedUpdateInput = inputData[i] as Prisma.ExerciceUncheckedUpdateInput;
  //     const inputMuscles: Array<Prisma.MuscleUncheckedUpdateWithoutExercicesInput> = exercice.muscles as Array<Prisma.MuscleUncheckedUpdateWithoutExercicesInput>
  //     transactionsTab.push(
  //       prisma.exercice.update({
  //         include: {muscles: true},
  //         where: {id: Number(exercice.id)},
  //         data:  {
  //           name: exercice.name,
  //           image: exercice.image,
  //           muscles: {
  //             connectOrCreate: inputMuscles.map((muscle) => {
  //               return {
  //                 where: {muscleId_exerciceId: {muscleId: muscle.id, exerciceId: Number(exercice.id)}},                  
  //                 create: {
  //                   muscle: {
  //                     connectOrCreate: {
  //                       create: {name: muscle.name},
  //                       where: {id: muscle.id}
  //                     },
  //                   }
  //                 }
  //               } as Prisma.ExercicesMusclesCreateOrConnectWithoutExerciceInput
  //             })
  //           }
  //         }
  //       })
  //     );
  //   }
  //   return await prisma.$transaction(transactionsTab);
  // }
  
