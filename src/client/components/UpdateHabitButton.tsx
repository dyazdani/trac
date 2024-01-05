import { IconButton } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useUpdateHabitMutation } from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";

const date1 = new Date("2024-01-04T10:30:53.604Z");
const date2 = new Date("2024-01-05T08:00:53.604Z");

const updateData = {
    name: "Bobbing for bananas",
    datesCompleted: [
        date1,
        date2
    ],
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

const UpdateHabitButton = () => {
    const [updateHabit, {data, isLoading, error}] = useUpdateHabitMutation()
    return (
        <IconButton 
            aria-label="Edit Habit"
            icon={<EditIcon />}
            onClick={ async () => {
                    const habit = await updateHabit({
                        id: 1, 
                        habitId: 2, 
                        newHabit: updateData
                    })
                    console.log(habit)
            }}
        />
    )
}

export default UpdateHabitButton;