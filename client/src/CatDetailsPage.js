import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CatDetailsPage() {
    const { id } = useParams();
    const [records, setRecords] = useState([]);
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

    // Handle delete cat 
    const handleDeleteCat = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this cat? All health records will also be deleted.');
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/cats/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                alert('Cat deleted successfully');
                navigate('/cats');
            } else {
                alert('Failed to delete cat');
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };



    useEffect(() => {
        fetch(`/api/cats/${id}/records`, {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setRecords(data))
        .catch(err => {
            console.error('Failed to load records:', err);
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
            {/* Return button */}
            <button 
                onClick={() => navigate(-1)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#EEEEEE',
                    cursor: 'pointer'
                }}>
                    ⬅ Back
            </button> 

          {/* basic info */}
          <h2>{cat ? cat.name + "'s Page" : "Loading..."}</h2>
          {cat && (
            <div style={{ marginBottom: '1em' }}>
              <p><strong>Name:</strong> {cat.name}</p>
              <p><strong>Age:</strong> {cat.age}</p>
              <p><strong>Weight:</strong> {cat.weight ?? 'N/A'} lb</p>
              <p><strong>Birthday:</strong> {cat.birthday ? new Date(cat.birthday).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Arrival Date:</strong> {cat.arrival_date ? new Date(cat.arrival_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Usual Food:</strong> {cat.usual_food ?? 'N/A'}</p>
              <p><strong>Dewormed:</strong> {cat.is_dewormed ? 'Yes' : 'No'}</p>
              <button onClick={() => navigate(`/cats/${id}/edit`)}>Edit Cat Info</button>
            </div>
          )}
      
          {/* add record */}
          <button onClick={() => navigate(`/cats/${id}/add-record`)}>
            ➕ Add Health Record
          </button>
      
          {/* health records */}
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
                  {/* Delete record */}
                  <button
                    onClick={() => handleDelete(record.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      color: 'red',
                      backgroundColor: '#EEEEEE',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                    ❌
                  </button>
      
                  {/* Edit record */}
                  <button
                    onClick={() => navigate(`/records/${record.id}/edit`)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '50px',
                      color: 'darkgray',
                      backgroundColor: '#EEEEEE',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                    ✏️
                  </button> 

                  <p><strong>Visit Date:</strong> {new Date(record.visit_date).toLocaleDateString()}</p>
                  <p><strong>Hospital:</strong> {record.hospital_name}</p>
                  <p><strong>Reason:</strong> {record.visit_reason}</p>
                  <p><strong>Symptoms:</strong> {record.symptom_description}</p>
                  <p><strong>Duration:</strong> {record.symptom_duration}</p>
                  <p><strong>Doctor's Advice:</strong> {record.doctor_notes}</p>
                </div>
              ))}
            </div>
          )}
      
          {/* delete cat button */}
          <div style={{ marginTop: '2em', textAlign: 'center' }}>
            <button
              onClick={handleDeleteCat}
              style={{
                color: 'black',
                backgroundColor: '#EEEEEE',
                padding: '5px 15px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
              ❌ Delete This Cat
            </button>
          </div>
        </div>
      );     
}