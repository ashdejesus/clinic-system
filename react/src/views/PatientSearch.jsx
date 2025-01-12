// src/components/PatientSearch.jsx
import React, { useState } from 'react';
import axiosClient from '../axios-client.js'; // Adjust the import based on your project structure

const PatientSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.get(`/patients/search?query=${searchQuery}`);
            setPatients(response.data.data); // Adjust based on your API response structure
        } catch (err) {
            setError('An error occurred while searching for patients.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <h1>Search Patients</h1>
            <input
                type="text"
                placeholder="Search by name or contact number"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key
            />
            <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>

            {error && <div className="alert alert-danger">{error}</div>}

            <ul>
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <li key={patient.id}>
                            {patient.full_name} - {patient.contact_number}
                        </li>
                    ))
                ) : (
                    <p>No patients found.</p>
                )}
            </ul>
        </div>
    );
};

export default PatientSearch;