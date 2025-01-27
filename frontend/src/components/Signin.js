import { useState, useEffect } from 'react';
import { auth } from './firebase.js'
import { Link, useNavigate, useLocation } from 'react-router-dom';


function Signin({onLogin, isLoggedIn}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const location = useLocation();
    useEffect(() => {
        if (isLoggedIn && location.pathname !== '/user') {
            navigate('/user');
        } else if (!isLoggedIn && location.pathname !== '/signin') {
            navigate('/signin')}
    }, [isLoggedIn, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           await onLogin(email, password);
        } catch (error) {
            console.error('Sign in error:', error.code, error.message);
            alert(error.message);
        }
    };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
      <Link to="/Signup">Don't have an account?</Link>
    </form>
  )
}

export default Signin