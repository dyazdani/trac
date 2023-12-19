/*
  Warnings:

  - Changed the type of `dayOfTheWeek` on the `CheckIn` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfTheWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "dayOfTheWeek",
ADD COLUMN     "dayOfTheWeek" "DayOfTheWeek" NOT NULL;
