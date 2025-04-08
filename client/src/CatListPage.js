import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function CatListPage() {
    const [cats, setCats] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    // load datas 
    useEffect(() => {
        fetch('https://cathealthsystem.onrender.com/api/cats', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setCats(data);
            })
            .catch(err => {
                console.error('Failed to fetch cats:', err);
                setError('Failed to load cats.');
            });
    },  []);

    return (
        <div>
            <h2>Cat List</h2>
            <button onClick={() => navigate('/add-cat')}>Add a cat</button><br />

            {error && <p>{error}</p>}
            {cats.length === 0 ? (
                <p>No cats found</p>
            ) : (
                <ul>
                    {cats.map(cat => (
                        <li key={cat.id}>
                            <p><strong>Name:</strong> {cat.name}</p>
                            <p><strong>Age:</strong> {cat.age ?? 'N/A'}</p>
                            <p><strong>Weight:</strong> {cat.weight ?? 'N/A'} lb</p>
                            <p><strong>Birthday:</strong> {cat.birthday ? new Date(cat.birthday).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Arrival:</strong> {cat.arrival_date ? new Date(cat.arrival_date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Usual Food:</strong> {cat.usual_food ?? 'N/A'}</p>
                            <p><strong>Dewormed:</strong> {cat.dewormed ? 'Yes' : 'No'}</p>

                            <button onClick={() => navigate(`/cats/${cat.id}`)}>View Details</button>
                            <button onClick={() => navigate(`/cats/${cat.id}/edit`)} style={{ marginLeft: '10px' }}>Edit</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}