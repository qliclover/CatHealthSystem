import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditRecordPage() {
    const { recordId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        visit_date: '',
        hospital_name: '',
        vet_name: '',
        visit_reason: '',
        symptom_description: '',
        symptom_duration: '',
        doctor_notes: '',
        catId: ''
    });

    const [message, setMessage] = useState('');

    // Read the record data
    useEffect(() => {
        fetch(`https://cathealthsystem.onrender.com/api/health_records/${recordId}`, {
            credentials:'include'
        })
        .then(res => res.json())
        .then(data => {
            const formatted = {
                ...data,
                visit_date: new Date(data.visit_date).toISOString().split('T')[0]
            };
            setForm(formatted);
        })
        .catch(err => {
            console.error("Failed to load record:", err);
        });
    }, [recordId]);

    // Handle inputs
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submit, update form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/health_records/${recordId}`,{
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Record updated');
            setTimeout(() => navigate(`/cats/${form.catId}`), 1000);
        } else {
            setMessage(data.error || 'Update failed');
        }
    };

    return (
        <div>
            <h2>Edit Health Record</h2>
            <form onSubmit={handleSubmit}>
                <label>Visit Date:
                    <input type="date" name="visit_date" value={form.visit_date} onChange={handleChange} required />
                </label><br />

                <label>Hospital Name:
                    <input name="hospital_name" value={form.hospital_name} onChange={handleChange} />
                </label><br />

                <label>Reason for visit:
                    <input name="visit_reason" value={form.visit_reason} onChange={handleChange} />
                </label><br />

                <label>Symptom Description:
                    <textarea name="symptom_description" value={form.symptom_description} onChange={handleChange} />
                </label><br />

                <label>Duration of Symptoms
                    <input name="symptom_duration" value={form.symptom_duration} onChange={handleChange} />
                </label><br />

                <label>Doctor's advice:
                    <input name="doctor_notes" value={form.doctor_notes} onChange={handleChange} />
                </label><br />

                <button type="submit">Update Record</button>
            </form>
            <p>{message}</p>
        </div>
    );
}