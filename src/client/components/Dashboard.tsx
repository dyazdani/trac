import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import DiamondCheckbox from "./DiamondCheckbox.js";


const Dashboard = () => {

    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
            <DiamondCheckbox/>
            <RightDrawer />
        </Box>
    )
}

export default Dashboard;