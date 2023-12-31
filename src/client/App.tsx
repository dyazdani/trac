import React from 'react'
// TODO: this import has a TS error when the "o" in the filepath is lowercase (i.e., "./components/RegisterForm.tsx"). WHY? 
import RegisterForm from "./components/RegisterFOrm.js"

const App: React.FC = () => {


  return (
    <div 
      className="App"
    >
      <RegisterForm />
    </div>
  );
}

export default App;
