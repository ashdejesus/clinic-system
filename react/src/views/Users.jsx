import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);
    // You can load backend users here as well, if needed, or keep localStorage users only
    const localUsers = JSON.parse(localStorage.getItem("patients")) || [];

    setUsers(localUsers);
    setFilteredUsers(localUsers);
    setLoading(false);
  };

  const deleteFromLocalStorage = (userId) => {
    const localUsers = JSON.parse(localStorage.getItem("patients")) || [];
    console.log("Current Local Users:", localUsers); // Debugging line

    // Filter out the user with the matching id
    const updatedLocalUsers = localUsers.filter((u) => u.id !== userId);
    console.log("Updated Local Users:", updatedLocalUsers); // Debugging line

    localStorage.setItem("patients", JSON.stringify(updatedLocalUsers));
    setNotification("Local patient was successfully deleted");
    getUsers(); // Refresh the users list
  };

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    // Delete from local storage only
    deleteFromLocalStorage(user.id);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query) ||
        user.id.toString().includes(query)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Patients</h1>
        <Link className="btn-add" to="/users/new">Add Patient</Link>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name or ID"
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
              <th>SOAP Notes</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name || u.full_name}</td>
                    <td>
                      <button className="btn-delete" onClick={() => onDeleteClick(u)}>
                        Delete
                      </button>
                    </td>
                    <td>
                      <Link className="btn-add" to={`/users/${u.id}/soap-notes`}>View Notes</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No patient found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}