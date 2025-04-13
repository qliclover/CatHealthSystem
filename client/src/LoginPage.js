import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

// Login page parts
export default function LoginPage({ onLogin }) {
    // use UseState to storage user's input of username and password
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const API_URL = 'https://cathealthsystem.vercel.app';

    // update when inputs change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // request login 
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Login successful!');
                // Call onLogin with user data and token
                onLogin({ 
                    username: form.username,
                    token: data.token 
                });
                navigate('/cats');
            } else {
                setMessage(data.error || 'Login failed');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
            console.error('Login error:', error);
        }
    };

    // Auto fill test account
    const fillTestAccount = () => {
        setForm({
            username: 'clover',
            password: '123456'
        });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="username" 
                    placeholder="Username" 
                    value={form.username}
                    onChange={handleChange} 
                /><br />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    value={form.password}
                    onChange={handleChange} 
                /><br />
                <button type="submit">Login</button>
            </form>
            <button 
                onClick={fillTestAccount}
                style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Use Test Account
            </button>
            <p>{message}</p>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}