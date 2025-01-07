/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "githubId" DROP NOT NULL,
ALTER COLUMN "linkedinId" DROP NOT NULL;
