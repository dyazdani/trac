import { User } from "@prisma/client"
import { useAppSelector } from "../app/hooks.js"
import Dashboard from "./Dashboard.js"
import LandingPage from "./LandingPage.js"
import { Navigate } from "react-router-dom"

export interface HomePageProps {
    isAuthenticated: boolean
  }

const HomePage = ({isAuthenticated}: HomePageProps) => {
    
    return (
        isAuthenticated ? 
        <Navigate to="/goals" replace />
        : <LandingPage/>
    )
}

export default HomePage;