import { Button } from "@chakra-ui/react"
import { useLoginMutation } from "../features/api.js"
import { useNavigate } from "react-router-dom";

const DemoUserButton = () => {
    const navigate = useNavigate();    
    const [login, { isLoading }] = useLoginMutation();

    return (
        <Button
            isLoading={isLoading}
            backgroundColor="skyblue.600"     
            color="floralwhite.50"    
            _hover={{
                backgroundColor: "skyblue.700"
            }}
            _active={{
                backgroundColor: "skyblue.800",
            }} 
            size="sm"
            onClick={async (e) => {
                e.preventDefault();
                try {
                    if (process.env.DEMO_USER_PASSWORD) {
                        const result = await login({
                            email: "demo_user@trac.app.co",
                            password: process.env.DEMO_USER_PASSWORD
                        }).unwrap()
                    } else {
                        console.error(new Error("Environmental variable used for demo user password is undefined"))
                    }
                    if (!isLoading) {
                        navigate("/goals");
                    }
                } catch (e) {
                    console.error(e)
                }
                
            }}
        >
            Log into Demo User
        </Button>
    )
}

export default DemoUserButton