import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import UpdateHabitButton from "./UpdateHabitButton.js";


const Dashboard = () => {

    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
            <RightDrawer />
            <UpdateHabitButton/>
        </Box>
    )
}

export default Dashboard;