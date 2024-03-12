import { Navigate } from "react-router-dom";
import RegisterPage from "../components/RegisterPage.js";

export interface RegisterProps { 
    isAuthenticated: boolean
}

const Register = ({isAuthenticated}: RegisterProps) => {
    

    return (
        isAuthenticated ? 
        <Navigate to="/goals" replace /> :
        <RegisterPage/>
    )
}

export default Register;