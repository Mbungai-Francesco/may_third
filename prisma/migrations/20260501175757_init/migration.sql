/*
  Warnings:

  - You are about to drop the column `town` on the `Wish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "town" TEXT;

-- AlterTable
ALTER TABLE "Wish" DROP COLUMN "town";
