import { Navigate } from "react-router-dom";
import LoginPage from "./LoginPage.js";
import { useAppSelector } from "../app/hooks.js";
import { User } from "@prisma/client";


const Login = () => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

    return (
        currentUser ? 
        <Navigate to="/goals" replace /> :
        <LoginPage/>
    )
}

export default Login;