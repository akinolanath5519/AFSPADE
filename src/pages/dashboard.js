import React from "react";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r border-gray-200">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Replace with an actual profile image if you have one */}
          <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-2">Dr. Sarah Wilson</h2>
          <p className="text-sm text-gray-600">Computer Science Department</p>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Manage Courses
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Manage Assignments
              </a>
            </li>
            {/* Add more nav items if needed */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Welcome back, Dr. Wilson</h1>
          <p className="text-gray-600">Spring Semester 2025</p>
        </header>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            + Add New Course
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            + Add Assignment
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Active Courses Card */}
          <div className="md:col-span-2 bg-white p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">Active Courses</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Advanced Database Systems (CS401)</span>
                <span className="text-sm text-gray-500">32 Students</span>
              </li>
              <li className="flex justify-between">
                <span>Web Development (CS402)</span>
                <span className="text-sm text-gray-500">28 Students</span>
              </li>
              <li className="flex justify-between">
                <span>Software Engineering (CS405)</span>
                <span className="text-sm text-gray-500">24 Students</span>
              </li>
            </ul>
          </div>

          {/* Upcoming Assignments Card */}
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Database Design Project (CS401)</span>
                <span className="text-red-600">Due Soon</span>
              </li>
              <li className="flex justify-between">
                <span>Frontend Framework Analysis (CS402)</span>
                <span className="text-blue-600">Upcoming</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            <li>New assignment added to CS401</li>
            <li>Updated course materials for Web Development</li>
            {/* More recent activity can be added here */}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
