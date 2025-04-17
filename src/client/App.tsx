import React from 'react'
import { 
  Route, 
  Routes 
} from 'react-router-dom'
import Dashboard from './components/Dashboard.js';
import HomePage from './components/HomePage.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import rainbowConsoleLogStyles from './constants/rainbowConsoleLogStyles.js'

const App: React.FC = () => {
  console.log("%c Welcome! d(-_☆)", rainbowConsoleLogStyles)  
  console.log("Hi, I'm Dara. Thanks for checking Trac. Feel free to reach out if you have any questions or just want connect: https://www.linkedin.com/in/darayazdani. You can find all my projects at https://www.darayazdani.com. Cheers!") 
  console

  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="goals" element={<Dashboard/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="login" element={<Login/>}/>
    </Routes>
  )

}

export default App;