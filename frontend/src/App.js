import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup.js';
import Signin from './components/Signin.js';
import User from './components/User.js';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirects to signin */}
        <Route path="/" element={<Navigate to="/signin" />} />

        <Route path="/signin" element={<Signin />} /> 

        <Route path="/signup" element={<Signup />} /> 

        <Route path="/user" element={<User/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
