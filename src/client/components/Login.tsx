import { Navigate } from "react-router-dom";
import LoginPage from "./LoginPage.js";

export interface LoginProps {
    isAuthenticated: boolean
}


const Login = ({isAuthenticated}: LoginProps) => {
  

    return (
        isAuthenticated ? 
        <Navigate to="/goals" replace />
         :
        <LoginPage/>
    )
}

export default Login;