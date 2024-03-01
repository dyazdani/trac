import { useAppSelector } from "../app/hooks.js"
import Dashboard from "./Dashboard.js"
import LandingPage from "./LandingPage.js"


const HomePage = () => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    return (
        currentUser ? 
        <Dashboard/>
        : <LandingPage/>
    )
}

export default HomePage;