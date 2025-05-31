/*
  Warnings:

  - You are about to drop the column `liderId` on the `Team` table. All the data in the column will be lost.
  - Added the required column `leaderId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "liderId",
ADD COLUMN     "leaderId" TEXT NOT NULL;
