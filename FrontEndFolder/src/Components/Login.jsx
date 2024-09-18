import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
        .then(result => {
            if(result.data.loginStatus) {
                localStorage.setItem("valid", true);
                navigate('/dashboard');
            } else {
                setError(result.data.Error);
            }
        })
        .catch(err => console.log(err));
    }


    return (
        <div style={loginPageStyle} className='loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                {error && <div className='text-warning'>{error}</div>}
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" name='email' autoComplete='off' placeholder='Enter your email'
                            onChange={(e) => setValues({...values, email: e.target.value})}
                            className='form-control'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" name='password' placeholder='Enter your password'
                            onChange={(e) => setValues({...values, password: e.target.value})}
                            className='form-control'/>
                    </div>
                    <button className='btn btn-success w-100'>Log in</button>
                </form>
            </div>
        </div>
    );
}


   // Inline styles for background image
    const loginPageStyle = {
        backgroundImage: "url()",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

export default Login;
