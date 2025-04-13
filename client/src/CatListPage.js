import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/CatList.css';

const CatListPage = () => {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const response = await fetch('https://cathealthsystem.vercel.app/api/cats');
                if (!response.ok) {
                    throw new Error('Failed to fetch cats');
                }
                const data = await response.json();
                setCats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCats();
    }, []);

    if (loading) {
        return <div className="cat-list-container">Loading...</div>;
    }

    if (error) {
        return <div className="cat-list-container">Error: {error}</div>;
    }

    return (
        <div className="cat-list-container">
            <h1 className="cat-list-title">Our Cats</h1>
            
            <Link to="/add-cat" className="add-cat-button">
                Add New Cat
            </Link>

            {cats.length === 0 ? (
                <p className="no-cats-message">No cats available at the moment.</p>
            ) : (
                <div className="cat-grid">
                    {cats.map(cat => (
                        <div key={cat.id} className="cat-card">
                            <div className="cat-info">
                                <h2 className="cat-name">{cat.name}</h2>
                                <div className="cat-details">
                                    <p>Age: {cat.age} years</p>
                                    <p>Weight: {cat.weight} lb</p>
                                    <p>Birthday: {cat.birthday ? new Date(cat.birthday).toLocaleDateString() : 'N/A'}</p>
                                    <p>Arrival: {cat.arrival_date ? new Date(cat.arrival_date).toLocaleDateString() : 'N/A'}</p>
                                    <p>Usual Food: {cat.usual_food || 'N/A'}</p>
                                    <p>Dewormed: {cat.is_dewormed ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="cat-actions">
                                    <Link to={`/cats/${cat.id}`} className="view-button">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CatListPage;