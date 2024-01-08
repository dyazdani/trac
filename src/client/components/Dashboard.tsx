import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import Habit from "./Habit.js";

import { useAppSelector } from "../app/hooks.js";

const Dashboard = () => {
  const currentUser = useAppSelector((state) => state.auth.user);


    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
         
            <RightDrawer />
            <Habit />

            {/* <UpdateHabitButton/> */}
        </Box>
    )
}

export default Dashboard;
