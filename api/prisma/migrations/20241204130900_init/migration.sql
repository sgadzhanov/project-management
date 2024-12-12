-- CreateTable
CREATE TABLE `Expert` (
    `expert_id` INTEGER NOT NULL AUTO_INCREMENT,
    `expert_type` CHAR(1) NOT NULL,
    `expert_name` VARCHAR(50) NULL,
    `expert_surname` VARCHAR(50) NULL,
    `expert_lastname` VARCHAR(50) NULL,

    PRIMARY KEY (`expert_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `project_id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_name` VARCHAR(191) NOT NULL,
    `project_description` VARCHAR(191) NULL,
    `project_client` VARCHAR(191) NOT NULL,
    `project_begin` DATETIME(3) NOT NULL,
    `project_end` DATETIME(3) NOT NULL,
    `project_status` INTEGER NOT NULL,
    `project_pay_per_hour` DOUBLE NULL,

    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectTask` (
    `task_id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `expert_id` INTEGER NOT NULL,
    `task_name` VARCHAR(191) NOT NULL,
    `task_description` VARCHAR(191) NULL,
    `task_deliverables` VARCHAR(191) NULL,
    `task_begin` DATETIME(3) NOT NULL,
    `task_end` DATETIME(3) NOT NULL,
    `task_priority` CHAR(1) NOT NULL,
    `task_status` INTEGER NOT NULL,
    `task_ready` INTEGER NULL,
    `task_hours` INTEGER NULL,

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectStatus` (
    `pstatus_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pstatus_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`pstatus_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskStatus` (
    `status_id` INTEGER NOT NULL AUTO_INCREMENT,
    `status_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_project_status_fkey` FOREIGN KEY (`project_status`) REFERENCES `ProjectStatus`(`pstatus_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectTask` ADD CONSTRAINT `ProjectTask_expert_id_fkey` FOREIGN KEY (`expert_id`) REFERENCES `Expert`(`expert_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectTask` ADD CONSTRAINT `ProjectTask_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectTask` ADD CONSTRAINT `ProjectTask_task_status_fkey` FOREIGN KEY (`task_status`) REFERENCES `TaskStatus`(`status_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
