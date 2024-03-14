import { Navigate } from "react-router-dom";
import RegisterPage from "../components/RegisterPage.js";
import { useAppSelector } from "../app/hooks.js";


const Register = () => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

    return (
        currentUser ? 
        <Navigate to="/goals" replace /> :
        <RegisterPage/>
    )
}

export default Register;