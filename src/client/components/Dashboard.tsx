import { Box, Button } from "@chakra-ui/react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import { useCreateHabitMutation } from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";
import RightDrawer from "./RightDrawer.js";

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
    const dispatch = useAppDispatch()
    const [createHabit, {data, isLoading, error}] = useCreateHabitMutation();

    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
            <p>Dashboard component</p>
            <Button
                type="button"
                onClick={() => {dispatch(logout())}}
            >
                Logout
            </Button>
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
            <RightDrawer />
        </Box>
        
    )
}

export default Dashboard;