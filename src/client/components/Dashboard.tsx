import { Box, Button } from "@chakra-ui/react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";
import RightDrawer from "./RightDrawer.js";


const Dashboard = () => {
    const dispatch = useAppDispatch()

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
            <RightDrawer />
        </Box>
        
    )
}

export default Dashboard;