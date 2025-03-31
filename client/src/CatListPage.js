import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function CatListPage() {
    const [cats, setCats] = useState([]);
    const [error, setError] = useState('');

    const Navigate = useNavigate(); 

    // load datas 
    useEffect(() => {
        fetch('/api/cats', {
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
            <button onClick={() => Navigate('/add-cat')}>Add a cat</button><br />

            {error && <p>{error}</p>}
            {cats.length === 0 ? (
                <p>No cats found</p>
            ) : (
                <ul>
                    {cats.map(cat => (
                        <li key={cat.id}>
                        <Link to={`/cats/${cat.id}`}>
                          <strong>{cat.name}</strong>
                        </Link> — Age: {cat.age}
                      </li>
                    ))}
                </ul>
            )}
        </div>
    );
}