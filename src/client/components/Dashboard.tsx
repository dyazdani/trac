import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";


const Dashboard = () => {

    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
            <RightDrawer />
        </Box>
    )
}

export default Dashboard;