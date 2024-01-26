/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId]` on the table `Habit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "scheduleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Habit_scheduleId_key" ON "Habit"("scheduleId");
