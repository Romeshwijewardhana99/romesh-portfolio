-- AlterTable
ALTER TABLE `project_images` ADD COLUMN `height` INTEGER NULL,
    ADD COLUMN `publicId` VARCHAR(191) NOT NULL,
    ADD COLUMN `width` INTEGER NULL;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `coverImagePublicId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `project_images_publicId_key` ON `project_images`(`publicId`);
