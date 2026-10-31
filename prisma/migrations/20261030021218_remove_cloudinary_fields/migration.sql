/*
  Warnings:

  - You are about to drop the column `publicId` on the `project_images` table. All the data in the column will be lost.
  - You are about to drop the column `coverImagePublicId` on the `projects` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `project_images_publicId_key` ON `project_images`;

-- AlterTable
ALTER TABLE `project_images` DROP COLUMN `publicId`;

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `coverImagePublicId`;

-- CreateIndex
CREATE INDEX `project_images_sortOrder_idx` ON `project_images`(`sortOrder`);
