import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup.js';
import Signin from './components/Signin.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirects to signin */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Sign in page route */}
        <Route path="/signin" element={<Signin />} /> {/* Use imported name */}

        {/* Sign up page route */}
        <Route path="/signup" element={<Signup />} /> {/* Use imported name */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
