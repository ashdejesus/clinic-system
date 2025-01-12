import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function PatientForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [patient, setPatient] = useState({
    id: null,
    full_name: '',
    date_of_birth: '',
    contact_number: ''
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/patients/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setPatient(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);

    if (patient.id) {
      axiosClient.put(`/patients/${patient.id}`, patient)
        .then(() => {
          setNotification('Patient was successfully updated');
          navigate('/patients');
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/patients', patient)
        .then(() => {
          setNotification('Patient was successfully created');
          navigate('/users');
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {patient.id ? <h1>Update Patient: {patient.full_name}</h1> : <h1>New Patient</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">Loading...</div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={patient.full_name}
              onChange={(ev) => setPatient({ ...patient, full_name: ev.target.value })}
              placeholder="Full Name"
            />
            <input
              type="date"
              value={patient.date_of_birth}
              onChange={(ev) => setPatient({ ...patient, date_of_birth: ev.target.value })}
              placeholder="Date of Birth"
            />
            <input
              value={patient.contact_number}
              onChange={(ev) => setPatient({ ...patient, contact_number: ev.target.value })}
              placeholder="Contact Number"
            />
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
