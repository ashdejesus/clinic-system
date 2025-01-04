import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useParams, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function SOAPNotes() {
  const { id } = useParams();  // Get the user ID from the URL
  const navigate = useNavigate();
  const [soapNotes, setSoapNotes] = useState([]);
  const [newSoapNote, setNewSoapNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  // Fetch SOAP notes for the user
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/patients/${id}/soap-notes`)
      .then(({ data }) => {
        setLoading(false);
        setSoapNotes(data.data); // Populate soap notes data
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  // Handle form submission for adding a new SOAP note
  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);

    axiosClient
      .post(`/patients/${id}/soap-notes`, newSoapNote)
      .then(() => {
        setNotification("SOAP Note added successfully");
        setNewSoapNote({ subjective: '', objective: '', assessment: '', plan: '' });
        setErrors(null);
        setLoading(false);
        navigate(`/users/${id}`);  // Redirect to the user's page or dashboard
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors); // Show validation errors
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>SOAP Notes for Patient {id}</h1>
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}

        {/* Display errors if any */}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {/* Display SOAP Notes */}
        <h2>Existing SOAP Notes</h2>
        {soapNotes.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Subjective</th>
                <th>Objective</th>
                <th>Assessment</th>
                <th>Plan</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {soapNotes.map((note) => (
                <tr key={note.id}>
                  <td>{note.subjective}</td>
                  <td>{note.objective}</td>
                  <td>{note.assessment}</td>
                  <td>{note.plan}</td>
                  <td>{note.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No SOAP Notes available for this patient.</p>
        )}

        {/* Add New SOAP Note Form */}
        <h2>Add New SOAP Note</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Subjective"
              value={newSoapNote.subjective}
              onChange={(e) => setNewSoapNote({ ...newSoapNote, subjective: e.target.value })}
              rows="4"
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Objective"
              value={newSoapNote.objective}
              onChange={(e) => setNewSoapNote({ ...newSoapNote, objective: e.target.value })}
              rows="4"
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Assessment"
              value={newSoapNote.assessment}
              onChange={(e) => setNewSoapNote({ ...newSoapNote, assessment: e.target.value })}
              rows="4"
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Plan"
              value={newSoapNote.plan}
              onChange={(e) => setNewSoapNote({ ...newSoapNote, plan: e.target.value })}
              rows="4"
            />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save SOAP Note'}
          </button>
        </form>
      </div>
    </div>
  );
}

