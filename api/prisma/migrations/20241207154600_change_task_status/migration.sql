/*
  Warnings:

  - A unique constraint covering the columns `[status_name]` on the table `TaskStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ProjectTask` DROP FOREIGN KEY `ProjectTask_task_status_fkey`;

-- AlterTable
ALTER TABLE `ProjectTask` MODIFY `task_status` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TaskStatus_status_name_key` ON `TaskStatus`(`status_name`);

-- AddForeignKey
ALTER TABLE `ProjectTask` ADD CONSTRAINT `ProjectTask_task_status_fkey` FOREIGN KEY (`task_status`) REFERENCES `TaskStatus`(`status_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
