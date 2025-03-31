import React, { useState, userState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    // create a form for username, email and password
    const [form, setForm] = useState({ username: '', email: '', password: '' });

    // create a message for shown error message
    const [message, setMessage] = useState('');

    // page jump
    const navigate = useNavigate;

    // handle change of form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // handle form submit
    const handleSubmit = async (e) => {
        // prevent browser refreash
        e.preventDefault();

        // POST form
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        // return data
        const data = await res.json();

        if (res.ok) {
            setMessage('Register successful!');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } else {
            setMessage(data.error || 'Register failed');
        }
    };

    // return form
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name='username' placeholder='Username' onChange={handleChange} /><br />
                <input name='email' placeholder='Email' onChange={handleChange} /><br />
                <input name='password' type='password' placeholder='Password' onChange={handleChange} /><br />
                <button type='submit'>Register</button>
            </form>
            <p>{message}</p>

            <p>
                Already hava and account? <Link to="/login">Login here</Link>
            </p>
        </div>
    )
}