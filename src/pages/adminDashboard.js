// src/pages/AdminDashboard.js
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <nav className="w-64 bg-teal-600 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <ul>
          <li><a href="/admin/users" className="block py-2 px-4 hover:bg-teal-500">Manage Users</a></li>
          <li><a href="/admin/settings" className="block py-2 px-4 hover:bg-teal-500">System Settings</a></li>
          <li><a href="/admin/logs" className="block py-2 px-4 hover:bg-teal-500">Logs & Usage</a></li>
          <li><a href="/profile" className="block py-2 px-4 hover:bg-teal-500">Profile</a></li>
          <li><a href="/logout" className="block py-2 px-4 hover:bg-teal-500">Logout</a></li>
        </ul>
      </nav>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border p-3 text-left">User</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-3">John Doe</td>
              <td className="border p-3">Lecturer</td>
              <td className="border p-3"><button className="text-teal-500">Edit</button> | <button className="text-red-500">Delete</button></td>
            </tr>
            {/* More rows here */}
          </tbody>
        </table>

        <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">System Settings</h2>
        <button className="bg-teal-500 text-white p-3 rounded-lg mb-6">Change Grading Scale</button>
        <button className="bg-teal-500 text-white p-3 rounded-lg mb-6">Modify Assignment Deadlines</button>

        <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">Logs & Usage</h2>
        <div className="bg-teal-100 p-4">
          <p><strong>Active Users:</strong> 150</p>
          <p><strong>Total Assignments Submitted:</strong> 1200</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
