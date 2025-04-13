import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddHealthRecordPage() {
    const [cats, setCats] = useState([]);
    const [form, setForm] = useState({
        catId: '',
        record_type: '', 
        value: ''
      });
      
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Load all cats info
    useEffect(() => {
        fetch('/api/cats', {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setCats(data))
        .catch(err => {
            console.error('Failed to load cats:', err);
        });
    }, []);

    // Update when form changed
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // POST form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/health_records', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Record added');
            setTimeout(() => navigate('/cats'), 1000);
        } else {
            setMessage(data.error || 'Failed to add record.');
        }
    };

    return (
        <div>
            <h2>Add Health Record</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Cat:
                    <select name="catId" value={form.catId} onChange={handleChange}>
                    <option value="">--Select a cat--</option>
                    {cats.map(cat => (
                        <option key={cat.id} value={cat.id}>
                        {cat.name}
                        </option>
                    ))}
                    </select>
                </label><br />

                <input
                    name="record_type"
                    placeholder="Type (e.g., checkup, vaccine)"
                    value={form.record_type}
                    onChange={handleChange}
                /><br />

                <input
                    name="value"
                    placeholder="Details (e.g., date, notes)"
                    value={form.value}
                    onChange={handleChange}
                /><br/>

                <button type="submit">Add Record</button>
            </form>

            <p>{message}</p>
        </div>
    );
}