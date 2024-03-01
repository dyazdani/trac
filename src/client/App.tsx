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

const App: React.FC = () => {
  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser


  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="goals" element={<Dashboard currentUser={currentUser}/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
      </Routes>
    </>
  );
}

export default App;