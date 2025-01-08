import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import {app} from './Signup.js'

const auth = getAuth(app);

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed in:', user);
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
      <button type="submit">Sign Up</button>
      
    </form>
  )
}

export default Signin