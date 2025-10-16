import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { apiFetch } from "../lib/api";
import Pagination from "./Pagination";

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearchTerm]);

  async function fetchUsers() {
    setUsersLoading(true);
    try {
      const res = await apiFetch(
        `/users?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}`
      );
      const data = await res.json();

      if (data.users) {
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
        setTotalUsers(data.totalUsers || 0);
      } else {
        // fallback
        const allUsers = await apiFetch("/users");
        const allData = await allUsers.json();
        const filteredUsers = debouncedSearchTerm
          ? allData.filter(
              (user) =>
                user.username
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()) ||
                user.email
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase())
            )
          : allData;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setUsers(filteredUsers.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredUsers.length / pageSize));
        setTotalUsers(filteredUsers.length);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  }

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const exportUsers = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Username,Email\n" +
      users.map((user) => `${user.username},${user.email}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await apiFetch(`/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
        alert(`User role changed to ${newRole} successfully!`);
      } else {
        alert("Failed to change user role");
      }
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Error changing user role");
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await apiFetch(`/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");

      fetchUsers(); // Refresh the list
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUser),
      });
      if (!res.ok) throw new Error("Failed to update user");

      setShowEditModal(false);
      fetchUsers(); // Refresh the list
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    }
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: "#DE5499" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-64 bg-white text-gray-900 placeholder-gray-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              WebkitTextFillColor: "#111827",
              caretColor: "#111827",
            }}
          />
          <button
            onClick={exportUsers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Export Users
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={user.role || "user"}
                    onChange={(e) => changeUserRole(user._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900 shadow-sm"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      WebkitTextFillColor: "#111827",
                      caretColor: "#111827",
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="View User"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Edit User"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete User"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalUsers}
        itemsPerPage={pageSize}
        showingText="Showing"
      />

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-medium text-gray-700">Username:</label>
                <p className="text-gray-900">{selectedUser.username}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Name:</label>
                <p className="text-gray-900">
                  {selectedUser.first_name} {selectedUser.last_name}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Phone:</label>
                <p className="text-gray-900">
                  {selectedUser.phone || "Not provided"}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Address:</label>
                <p className="text-gray-900">
                  {selectedUser.address || "Not provided"}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Role:</label>
                <p className="text-gray-900 capitalize">
                  {selectedUser.role || "user"}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Username:
                </label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    WebkitTextFillColor: "#111827",
                    caretColor: "#111827",
                  }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    WebkitTextFillColor: "#111827",
                    caretColor: "#111827",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    First Name:
                  </label>
                  <input
                    type="text"
                    value={selectedUser.first_name || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      WebkitTextFillColor: "#111827",
                      caretColor: "#111827",
                    }}
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    value={selectedUser.last_name || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#111827",
                      WebkitTextFillColor: "#111827",
                      caretColor: "#111827",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Phone:
                </label>
                <input
                  type="tel"
                  value={selectedUser.phone || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    WebkitTextFillColor: "#111827",
                    caretColor: "#111827",
                  }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Address:
                </label>
                <textarea
                  value={selectedUser.address || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    WebkitTextFillColor: "#111827",
                    caretColor: "#111827",
                  }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Role:
                </label>
                <select
                  value={selectedUser.role || "user"}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-gray-900 shadow-sm"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    WebkitTextFillColor: "#111827",
                    caretColor: "#111827",
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
