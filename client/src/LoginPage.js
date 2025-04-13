import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import API_BASE_URL from './config';

// Login page parts
export default function LoginPage() {
    // use UseState to storage user's input of username and password
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    // update when inputs change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // request login 
        const res = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Login successful!');
            setTimeout(() => {
                navigate('/cats');
            }, 1000);
        } else {
            setMessage(data.error || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" onChange={handleChange} /><br />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}