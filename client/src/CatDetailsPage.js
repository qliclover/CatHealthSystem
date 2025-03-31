import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CatDetailsPage() {
    const { id } = useParams();
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const [cat, setCats] = useState(null);
    const navigate = useNavigate();

    // Handle delete function
    const handleDelete = async (recordId) => {
        const confirmed = window.confirm('Are you sure you want to delete this record?');
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/health_records/${recordId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setRecords(records.filter(r => r.id !== recordId));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    useEffect(() => {
        fetch(`/api/cats/${id}/records`, {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setRecords(data))
        .catch(err => {
            setError('Failed to load records');
        });
    }, [id]);

    useEffect(() => {
        async function fetCatInfo() {
            try {
                const res = await fetch(`/api/cats/${id}`, {
                    credentials: 'include'
                });
                
                if (!res.ok) throw new Error('Failed to fetch cat info');
                const data = await res.json();
                setCats(data);
            } catch (err) {
                console.error('Failed to fetch cat info:', err);
            }
        }

        fetCatInfo();
    }, [id]);

    return (
        <div>
            <button onClick={() => navigate(`/cats/${id}/add-record`)}>
                ➕ Add Health Record
            </button>

            {records.length === 0 ? (
                <p>No records found.</p>
            ) : (
                <div>
                {records.map(record => (
                    <div
                    key={record.id}
                    style={{
                        border: '1px solid #ccc',
                        padding: '1em',
                        marginBottom: '1em',
                        borderRadius: '8px',
                        position: 'relative'
                    }}
                    >
                    <button
                        onClick={() => handleDelete(record.id)}
                        style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                        }}
                    >
                        ❌
                    </button>

                    <p><strong>🗓️ Visit Date:</strong> {new Date(record.visit_date).toLocaleDateString()}</p>
                    <p><strong>🏥 Hospital:</strong> {record.hospital_name}</p>
                    <p><strong>👩‍⚕️ Veterinarian:</strong> {record.vet_name}</p>
                    <p><strong>📋 Reason:</strong> {record.visit_reason}</p>
                    <p><strong>💬 Symptoms:</strong> {record.symptom_description}</p>
                    <p><strong>⏳ Duration:</strong> {record.symptom_duration}</p>
                    <p><strong>📝 Doctor's Advice:</strong> {record.doctor_notes}</p>
                    </div>
                ))}
        </div>
  )}
</div>

    );
}