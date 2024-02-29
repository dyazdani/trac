import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import LandingPage from './components/LandingPage.js'
import Dashboard from './components/Dashboard.js';
import RegisterPage from './components/RegisterPage.js';
import LoginPage from './components/LoginPage.js';
import { useAppSelector } from './app/hooks.js';

const App: React.FC = () => {
  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

    return (
      <>
        <Routes>
          <Route path="/" element={currentUser ? <Dashboard/> : <LandingPage/>}/>
          <Route path="/goals" element={<Dashboard/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>

        </Routes>
      </>
    );
}

export default App;