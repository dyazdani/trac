-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "milestoneId" INTEGER;

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "isCanceled" BOOLEAN NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
