/*
  Warnings:

  - You are about to alter the column `task_status` on the `ProjectTask` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `ProjectTask` DROP FOREIGN KEY `ProjectTask_task_status_fkey`;

-- DropIndex
DROP INDEX `TaskStatus_status_name_key` ON `TaskStatus`;

-- AlterTable
ALTER TABLE `ProjectTask` MODIFY `task_status` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectTask` ADD CONSTRAINT `ProjectTask_task_status_fkey` FOREIGN KEY (`task_status`) REFERENCES `TaskStatus`(`status_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
