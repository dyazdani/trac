const { PrismaClient } = require("@prisma/client");
const { users, habits, checkIns, contacts } = require('./seedData.json');
const prisma = new PrismaClient();

const load = async () => {
    try {
        await prisma.habit.deleteMany();
        console.log("Deleted records in habits table")

        await prisma.checkIn.deleteMany();
        console.log("Deleted records in checkIns table");
        
        await prisma.user.deleteMany();
        console.log("Deleted records in users table");

        await prisma.contact.deleteMany();
        console.log("Deleted records in contacts table");

        await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
        console.log("reset user auto increment to 1")

        await prisma.$executeRaw`ALTER SEQUENCE "Habit_id_seq" RESTART WITH 1;`;
        console.log("reset habit auto increment to 1")

        await prisma.$executeRaw`ALTER SEQUENCE "CheckIn_id_seq" RESTART WITH 1;`;
        console.log("reset checkIn auto increment to 1")

        await prisma.$executeRaw`ALTER SEQUENCE "Contact_id_seq" RESTART WITH 1;`;
        console.log("reset contact auto increment to 1")

        await prisma.user.createMany({
            data: users
        });
        console.log("Added user data");

        await prisma.habit.createMany({
            data: habits
        });
        console.log("Added habit data")

        await prisma.checkIn.createMany({
            data: checkIns
        });
        console.log("Added checkIn data")

        await prisma.contact.createMany({
            data: contacts
        });
        console.log("Added contact data")

    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect()
        process.exit(0);
    }
}

load();

