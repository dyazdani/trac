import { useAppSelector } from "../app/hooks.js"
import LandingPage from "./LandingPage.js"
import { Navigate } from "react-router-dom"


const HomePage = () => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

    return (
        currentUser ? 
        <Navigate to="/goals" replace />
        : <LandingPage/>
    )
}

export default HomePage;