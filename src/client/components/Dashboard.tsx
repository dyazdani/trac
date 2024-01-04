import { Button } from "@chakra-ui/react";
import { useCreateHabitMutation } from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";
import MyHabits from "./MyHabits.js";

const habitDetails = {
    name: `"THIS IS A TEST"`,
    routineDays: {
        monday: false,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: false
    },
    checkInDay: DayOfTheWeek.MONDAY
}

const Dashboard = () => {
    const [createHabit, {data, isLoading, error}] = useCreateHabitMutation();

    return (
        <>
            <p>Dashboard component</p>
            <MyHabits />
            <Button
                type="button"
                onClick={async (e) => {
                    e.preventDefault();
                    if (!isLoading) {
                        const data = await createHabit({id: 2, habitDetails});
                        if (error) {
                            console.error(error);
                        } 
                        if (data) {
                            console.log(data);
                        }
                    }

                }}
            >
                Create Habit
            </Button>
        </>
        
    )
}

export default Dashboard;