import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import DiamondCheckbox from "./DiamondToggleButton.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import ToggleButton from "./ToggleButton.js";
import DiamondToggleButton from "./DiamondToggleButton.js";


const Dashboard = () => {

    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
            <DiamondToggleButton/>
            <RightDrawer />
            {/* <UpdateHabitButton/> */}
        </Box>
    )
}

export default Dashboard;