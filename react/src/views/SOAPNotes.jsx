// SoapNotes.jsx
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useParams, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function SoapNotes() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const { setNotification } = useStateContext();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    setLoading(true);
    axiosClient
      .get(`/users/${id}/soap-notes`)
      .then(({ data }) => {
        setLoading(false);
        setNotes(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleAddNote = () => {
    if (!newNote.subjective || !newNote.objective || !newNote.assessment || !newNote.plan) {
      setNotification("All fields are required");
      return;
    }

    axiosClient
      .post(`/users/${id}/soap-notes`, newNote)
      .then(() => {
        setNotification("SOAP note added successfully");
        setNewNote({
          subjective: "",
          objective: "",
          assessment: "",
          plan: "",
        });
        getNotes();
      })
      .catch(() => {
        setNotification("Failed to add SOAP note");
      });
  };

  const handleDeleteNote = (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    axiosClient
      .delete(`/users/${id}/soap-notes/${noteId}`)
      .then(() => {
        setNotification("SOAP note deleted successfully");
        getNotes();
      })
      .catch(() => {
        setNotification("Failed to delete SOAP note");
      });
  };

  return (
    <div>
      <h1>SOAP Notes for Patient ID: {id}</h1>
      <div>
        <input
          type="text"
          value={newNote.subjective}
          onChange={(e) => setNewNote({ ...newNote, subjective: e.target.value })}
          placeholder="Subjective"
        />
        <input
          type="text"
          value={newNote.objective}
          onChange={(e) => setNewNote({ ...newNote, objective: e.target.value })}
          placeholder="Objective"
        />
        <input
          type="text"
          value={newNote.assessment}
          onChange={(e) => setNewNote({ ...newNote, assessment: e.target.value })}
          placeholder="Assessment"
        />
        <input
          type="text"
          value={newNote.plan}
          onChange={(e) => setNewNote({ ...newNote, plan: e.target.value })}
          placeholder="Plan"
        />
        <button className="btn-add"  onClick={handleAddNote}>Save Note</button>
      </div>
      <div className="card animated fadeInDown">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {notes.length > 0 ? (
              notes.map((note) => (
                <li key={note.id}>
                  <strong>Subjective:</strong> {note.subjective} <br />
                  <strong>Objective:</strong> {note.objective} <br />
                  <strong>Assessment:</strong> {note.assessment} <br />
                  <strong>Plan:</strong> {note.plan} <br />
                  <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                </li>
              ))
            ) : (
              <p>No SOAP notes found.</p>
            )}
          </ul>
        )}
      </div>
      <Link  className="btn-add"  to="/users">Back to Patients</Link>
    </div>
  );
}