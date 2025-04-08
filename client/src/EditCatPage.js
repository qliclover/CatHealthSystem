import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCatPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        age: '',
        weight: '',
        birthday: '',
        arrival_date: '',
        usual_food: '',
        is_dewormed: false
    });

    const [message, setMessage] = useState('');

    // Read the record data
    useEffect(() => {
        fetch(`https://cathealthsystem.onrender.com/api/cats/${id}`, {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            setForm({
                name: data.name || '',
                age: data.age?.toString() || '',
                weight: data.weight?.toString() || '',
                birthday: data.birthday?.split('T')[0] || '',
                arrival_date: data.arrival_date?.split('T')[0] || '',
                usual_food: data.usual_food || '',
                is_dewormed: data.is_dewormed || false
            });
        })
        .catch(err => {
            console.error('Failed to load cat info:', err);
        });
    }, [id]);

    // Handle inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    // Handle form submit, update form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`/api/cats/${id}`,{
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Cat updated');
            setTimeout(() => navigate(`/cats/${id}`), 1000);
        } else {
            setMessage(data.error || 'Update failed');
        }
    };

    return (
        <div>
            <h2>Edit Cat Info</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:
                    <input name="name" value={form.name} onChange={handleChange} required />
                </label><br />

                <label>Age:
                    <input name="age" value={form.age} onChange={handleChange} />
                </label><br />

                <label>Weight:
                    <input name="weight" value={form.weight} onChange={handleChange} />
                </label><br />

                <label>Birthday:
                    <input name="birthday" type="date" value={form.birthday} onChange={handleChange} />
                </label><br />

                <label>Arrival Date: 
                    <input name="arrival_date" type="date" value={form.arrival_date} onChange={handleChange}/>
                </label><br />

                <label>Usual Food:
                    <input name="usual_food" value={form.usual_food} onChange={handleChange} />
                </label><br />

                <label>Dewormed:
                    <input name="is_dewormed" type="checkbox" checked={form.is_dewormed} onChange={handleChange} />
                </label><br />

                <button type="submit">Save</button>
            </form>
            <p>{message}</p>
        </div>
    );
}