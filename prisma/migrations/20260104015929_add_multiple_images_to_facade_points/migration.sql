/*
  Warnings:

  - You are about to drop the column `mainImage` on the `FacadePoint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FacadePoint" DROP COLUMN "mainImage",
ADD COLUMN     "images" TEXT[];
