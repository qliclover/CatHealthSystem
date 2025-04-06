import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function AddCatPage() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [form, setForm] = useState({ 
        name: '', 
        age: '',
        weight: '',
        birthday: '',
        arrival_date: '',
        usual_food: '',
        is_dewormed: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ 
            ...form, 
            [name]: type === 'checkbox' ? checked : value   
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/cats', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
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
                <label>Name:
                    <input name="name" value={form.name} onChange={handleChange} required />
                </label><br />

                <label>Age:
                    <input name="age" type="number" value={form.age} onChange={handleChange} />
                </label><br />

                <label>Weight(lb):
                    <input name="weight" type="number" value={form.weight} onChange={handleChange} />
                </label><br />

                <label>Birthday:
                    <input name="birthday" type="date" value={form.birthday} onChange={handleChange}/>
                </label><br />

                <label>Date of Arrival:
                    <input name="arrival_date" type="date" value={form.arrival_date} onChange={handleChange} />
                </label><br />

                <label>Usual Food:
                    <input name="usual_food" value={form.usual_food} onChange={handleChange} />
                </label><br />

                <label>dewormed:
                    <input name="dewormed" type="checkbox" checked={form.is_dewormed} onChange={handleChange} />
                </label><br />

                <button type="submit">Add Cat</button>
            </form>
            <p>{message}</p>
        </div>
    );
}