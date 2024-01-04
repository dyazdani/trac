import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage.js';
import Dashboard from './components/Dashboard.js';
import { useAppSelector } from './app/hooks.js';
import FloatingActionButton from './components/FloatingActionButton.js';

const App: React.FC = () => {
const currentUser = useAppSelector((state) => state.auth.user);

  return (
      <>
        {currentUser && <FloatingActionButton />}
        <Routes>
          <Route path="/" element={currentUser ? <Dashboard /> : <LandingPage />}/>
        </Routes>
      </>

  );
}

export default App;