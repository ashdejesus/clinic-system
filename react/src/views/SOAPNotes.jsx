import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function SoapNotes() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const { setNotification } = useStateContext();

  useEffect(() => {
    // Load notes from local storage
    const savedNotes = JSON.parse(localStorage.getItem(`soapNotes-${id}`)) || [];
    setNotes(savedNotes);
  }, [id]);

  const handleAddNote = () => {
    if (!newNote.subjective || !newNote.objective || !newNote.assessment || !newNote.plan) {
      setNotification("All fields are required");
      return;
    }

    const updatedNotes = [...notes, { ...newNote, id: Date.now() }];
    setNotes(updatedNotes);
    setNewNote({ subjective: "", objective: "", assessment: "", plan: "" });

    // Save updated notes to local storage
    localStorage.setItem(`soapNotes-${id}`, JSON.stringify(updatedNotes));

    setNotification("SOAP note added successfully");
  };

  const handleDeleteNote = (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);

    // Update local storage
    localStorage.setItem(`soapNotes-${id}`, JSON.stringify(updatedNotes));

    setNotification("SOAP note deleted successfully");
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
        <button className="btn-add" onClick={handleAddNote}>Save Note</button>
      </div>
      
      <div className="card animated fadeInDown">
        {notes.length === 0 ? (
          <p>No SOAP notes found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Subjective</th>
                <th>Objective</th>
                <th>Assessment</th>
                <th>Plan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <td>{note.subjective}</td>
                  <td>{note.objective}</td>
                  <td>{note.assessment}</td>
                  <td>{note.plan}</td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDeleteNote(note.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link className="btn-add" to="/users">Back to Patients</Link>
    </div>
  );
}
