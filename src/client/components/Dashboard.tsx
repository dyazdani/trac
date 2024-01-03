import { Button } from "@chakra-ui/react";
import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";

const Dashboard = () => {
    const dispatch = useAppDispatch()

    return (
        <>
            <p>Dashboard component</p>
            <Button
                type="button"
                onClick={() => {dispatch(logout())}}
            >
                Logout
            </Button>
        </>
        
    )
}

export default Dashboard;