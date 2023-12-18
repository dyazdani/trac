import { PrismaClient } from "@prisma/client";
import { users, habits, routines, checkIns} from './seedData.json';
const prisma = new PrismaClient();

interface HabitSeedData {
    name: string
    datesCompleted: string[]
    ownerId: number
}

const habitsWithDateObjects = habits.map((habit: HabitSeedData) => {
    return ({
        ...habit,
        datesCompleted: habit.datesCompleted.map((date: string) => new Date(date)) 
    })
})

const load = async () => {
    try {
        await prisma.habit.deleteMany();
        console.log("Deleted records in habits table")

        await prisma.routine.deleteMany();
        console.log("Deleted records in routines table");
        
        await prisma.user.deleteMany();
        console.log("Deleted records in users table");

        await prisma.checkIn.deleteMany();
        console.log("Deleted records in checkIns table")

        await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
        console.log("reset user auto increment to 1")

        await prisma.$executeRaw`ALTER SEQUENCE "Habit_id_seq" RESTART WITH 1;`;
        console.log("reset habit auto increment to 1")

        await prisma.$executeRaw`ALTER SEQUENCE "Routine_id_seq" RESTART WITH 1;`;
        console.log("reset routine auto increment to 1")

        await prisma.$executeRaw`ALTER SEQUENCE "CheckIn_id_seq" RESTART WITH 1;`;
        console.log("reset checkIn auto increment to 1")

        await prisma.user.createMany({
            data: users
        });
        console.log("Added user data");

        await prisma.habit.createMany({
            data: habitsWithDateObjects
        });
        console.log("Added habit data")

        await prisma.routine.createMany({
            data: routines
        });
        console.log("Added routine data")

        await prisma.checkIn.createMany({
            data: checkIns
        });
        console.log("Added checkIn data")

    } catch(e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

load();

