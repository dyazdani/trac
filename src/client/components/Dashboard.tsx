import { Box, HStack } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import ToggleButton from "./ToggleButton.js";


const Dashboard = () => {
    return (
        <Box
            as="div"
            h="100vh"
            w="100vw"
        >
            <HStack
                ml="10px"
                mt="50px"
            >
                {/* TODO: these test toggle buttons will need to be removed */}
                <ToggleButton date={new Date("2024-01-04")} isCheckInDay={true}/>
                <ToggleButton date={new Date("2024-01-05")} isCheckInDay={false}/>
                <ToggleButton date={new Date(Date.now())} isCheckInDay={false}/>
            </HStack>
            <RightDrawer />
            {/* <UpdateHabitButton/> */}
        </Box>
    )
}

export default Dashboard;