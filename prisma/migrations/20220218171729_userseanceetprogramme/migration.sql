/*
  Warnings:

  - Added the required column `userId` to the `Progression` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Seance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Progression` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Seance` ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Seance` ADD CONSTRAINT `Seance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
