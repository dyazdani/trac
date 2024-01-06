import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import DiamondCheckbox from "./DiamondCheckbox.js";
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
            <ToggleButton
                date={new Date("1990-01-01")}
            />
        </Box>
    )
}

export default Dashboard;