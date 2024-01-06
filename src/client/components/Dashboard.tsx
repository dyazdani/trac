import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import DiamondCheckbox from "./DiamondToggleButton.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import ToggleButton from "./ToggleButton.js";


const Dashboard = () => {

    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
            <DiamondCheckbox/>
            <RightDrawer />
            {/* <UpdateHabitButton/> */}
        </Box>
    )
}

export default Dashboard;