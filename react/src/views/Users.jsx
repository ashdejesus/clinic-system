import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // To manage search results
  const [searchQuery, setSearchQuery] = useState(""); // To track search input
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  // Fetch the list of users
  useEffect(() => {
    getUsers();
  }, []);

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient
      .delete(`/users/${user.id}`)
      .then(() => {
        setNotification("User was successfully deleted");
        getUsers();
      });
  };

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        setFilteredUsers(data.data); // Initialize filteredUsers with full data
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on the query
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) || 
        user.id.toString().includes(query)
    );

    setFilteredUsers(filtered);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Users</h1>
        <Link className="btn-add" to="/users/new">Add User</Link>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchQuery}
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
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
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
                    <td>{u.name}</td>
                    <td>{u.created_at}</td>
                    <td>
                      {/* Navigate to the SOAP Notes page for the user */}
                      <Link className="btn-edit" to={`/users/${u.id}/soap-notes`}>Add Note</Link>
                      &nbsp;
                      <button className="btn-delete" onClick={() => onDeleteClick(u)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found.
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
