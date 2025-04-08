import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddRecordForCatPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        catId: id,
        visit_date: '',
        hospital_name: '',
        vet_name: '',
        visit_reason: '',
        symptom_description: '',
        symptom_duration: '',
        doctor_notes: ''
      });      

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('https://cathealthsystem.onrender.com/api/health_records', {
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
            setTimeout(() => navigate(`/cats/${id}`), 1000);
        } else {
            setMessage(data.error || 'Failed to add record.')
        }
    };

    return (
        <div>
            <h2>Add Health Record for Cat #{id}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Visit Date:
                    <input
                        type="date"
                        name="visit_date"
                        value={form.visit_date}
                        onChange={handleChange}
                        required/>
                </label><br />

                <label>
                    Hospital Name:
                    <input 
                        name="hospital_name"
                        value={form.hospital_name}
                        onChange={handleChange}
                        required/>
                </label><br />

                <label>
                    Reason for visit:
                    <input 
                        name="visit_reason"
                        value={form.visit_reason}
                        onChange={handleChange}/>
                </label><br />

                <label>
                    Symptom Description:
                    <textarea 
                        name="symptom_description"
                        value={form.symptom_description}
                        onChange={handleChange}/>
                </label><br />

                <label>
                    Duration of symptoms:
                    <input 
                        name="symptom_duration"
                        value={form.symptom_duration}
                        onChange={handleChange}/>
                </label><br />

                <label>
                    Doctor's advice:
                    <textarea 
                        name="doctor_notes"
                        value={form.doctor_notes}
                        onChange={handleChange}/>
                </label><br />
                
                <button type="submit">Submit Record</button>
            </form>
            <p>{message}</p>
        </div>
    );
}