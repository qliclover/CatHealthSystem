import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function AddCatPage() {
    const [form, setForm] = useState({ name: '', age: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/cats', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: form.name,
                age: form.age
              })
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Cat added!');
            setTimeout(() => navigate('/cats'), 1000);
        } else {
            setMessage(data.error || 'Failed to add cat.');
        }
    };

    return (
        <div>
            <h2>Add a New Cat</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Cat Name" onChange={handleChange} /><br />
                <input name="age" type="number" placeholder="Age" onChange={handleChange} /><br />
                <button type="submit">Add Cat</button>
            </form>
            <p>{message}</p>
        </div>
    );
}