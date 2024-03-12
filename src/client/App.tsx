import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import Dashboard from './components/Dashboard.js';
import HomePage from './components/HomePage.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import { useAppSelector } from './app/hooks.js';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Link, Text } from '@chakra-ui/react';

const App: React.FC = () => {
  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage isAuthenticated={!!currentUser}/>}/>
        <Route path="goals" element={<Dashboard isAuthenticated={!!currentUser}/>}/>
        <Route path="register" element={<Register isAuthenticated={!!currentUser}/>}/>
        <Route path="login" element={<Login isAuthenticated={!!currentUser}/>}/>
      </Routes>
    </>
  );
}

export default App;