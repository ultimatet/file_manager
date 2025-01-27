import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Signup from './components/Signup.js';
import Signin from './components/Signin.js';
import User from './components/User.js';
import { auth } from './components/firebase.js'
import { signOut } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setTimeout(() => {
      setIsLoggedIn(!!user);
    }, 100);  // Small delay to ensure state updates properly
  });
  return () => unsubscribe();
}, []);

  const handleLogin = async (email, password) => {
          try {
              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
              console.log('User signed in app:', user);
              setIsLoggedIn(true)
          } catch (error) {
              console.error('Sign in error:', error.code, error.message);
              alert(error.message);
              setIsLoggedIn(false);
          }
      };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error.code, error.message);
      alert(error.message);
      setIsLoggedIn(true);
    }
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirects to signin */}
        <Route path="/" element={<Navigate replace to={isLoggedIn ? '/user' : '/signin'} />} />

        <Route path="/signin" element={isLoggedIn ? (<Navigate replace to ='/user'/>) : (<Signin onLogin={handleLogin} isLoggedIn={isLoggedIn}/>)} />

        <Route path="/signup" element={<Signup />} /> 

        <Route path="/user" element={isLoggedIn ? (<User onLogout={handleLogout}/>) : (<Navigate replace to ='/signin'/>)} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
