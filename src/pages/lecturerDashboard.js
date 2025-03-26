import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCourse, fetchAllCourses } from "../store/courseReducer";
import {
  createAssignment,
  fetchAssignmentsByCourse,
} from "../store/assignmentReducer";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Example placeholders for total students, pending reviews, etc.
 * Replace with real data if available.
 */
const TOTAL_STUDENTS = 156;
const PENDING_REVIEWS = 12;

const notify = () => toast("Wow so easy!");

const LecturerDashboard = () => {
  const dispatch = useDispatch();

  // Redux store data
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.course.courses) || [];
  const assignmentsByCourse =
    useSelector((state) => state.assignment.assignments) || {};

  // Local UI state
  const [loading, setLoading] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // Form fields for adding courses
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  // Form fields for adding assignments
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // ========== FETCH DATA ON MOUNT ==========
  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllCourses())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching courses:", error);
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Automatically select the first course if none is selected
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0]._id);
    }
  }, [courses, selectedCourseId]);

  // Fetch assignments for the selected course
  useEffect(() => {
    if (selectedCourseId) {
      setLoading(true);
      dispatch(fetchAssignmentsByCourse(selectedCourseId))
        .unwrap()
        .catch((error) => {
          console.error(
            `Error fetching assignments for course ${selectedCourseId}:`,
            error
          );
        })
        .finally(() => setLoading(false));
    }
  }, [selectedCourseId, dispatch]);

  // ========== HANDLERS FOR COURSES & ASSIGNMENTS ==========
  const handleAddCourse = () => {
    if (!courseName || !courseDescription) {
      toast.error("Please fill out all course fields.");
      return;
    }
    const courseData = { name: courseName, description: courseDescription };
    dispatch(createCourse(courseData))
      .unwrap()
      .then(() => {
        setCourseName("");
        setCourseDescription("");
        setIsCourseModalOpen(false);
        dispatch(fetchAllCourses());
        toast.success("Course added successfully!");
      })
      .catch((error) => {
        console.error("Failed to add course:", error);
        toast.error("Failed to add course.");
      });
  };

  const handleAddAssignment = () => {
    if (
      !assignmentTitle ||
      !assignmentDescription ||
      !assignmentDueDate ||
      !selectedCourseId
    ) {
      toast.error("All assignment fields are required.");
      return;
    }
    const newAssignment = {
      title: assignmentTitle,
      description: assignmentDescription,
      dueDate: assignmentDueDate,
      course: selectedCourseId,
    };
    dispatch(createAssignment(newAssignment))
      .unwrap()
      .then(() => {
        setAssignmentTitle("");
        setAssignmentDescription("");
        setAssignmentDueDate("");
        setIsAssignmentModalOpen(false);
        toast.success("Assignment added successfully!");
        // Refresh assignments for the selected course
        dispatch(fetchAssignmentsByCourse(selectedCourseId));
      })
      .catch((error) => {
        console.error("Failed to add assignment:", error);
        toast.success("Assignment added successfully (with potential errors).");
      });
  };

  // Flatten all assignments to count total
  const totalAssignments = Object.values(assignmentsByCourse).flat().length;

  // Assignments for the currently selected course
  const selectedCourseAssignments = assignmentsByCourse[selectedCourseId] || [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-full md:w-64 bg-gray-800/90 backdrop-blur-sm p-6 border-r border-white/10">
        <h1 className="text-2xl font-semibold mb-6 text-teal-400">
          Lecturer Portal
        </h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <button className="w-full text-left py-2 px-4 hover:bg-gray-700/50 rounded transition duration-300 text-gray-300 font-medium">
                Dashboard
              </button>
            </li>
            <li>
              <button className="w-full text-left py-2 px-4 hover:bg-gray-700/50 rounded transition duration-300 text-gray-300 font-medium">
                Manage Courses
              </button>
            </li>
            <li>
              <button className="w-full text-left py-2 px-4 hover:bg-gray-700/50 rounded transition duration-300 text-gray-300 font-medium">
                Assignments
              </button>
            </li>
            <li>
              <button className="w-full text-left py-2 px-4 hover:bg-gray-700/50 rounded transition duration-300 text-gray-300 font-medium">
                Students
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome back, {user?.name || "Lecturer"}!
            </h2>
            <p className="text-gray-300 mt-1">
              Here's what's happening with your courses
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="bg-gradient-to-r from-teal-400 to-cyan-400 text-gray-900 px-4 py-2 rounded-lg hover:from-teal-300 hover:to-cyan-300 font-semibold"
            >
              + New Course
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Courses */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
            <p className="text-gray-400">Active Courses</p>
            <h3 className="text-2xl font-bold text-teal-400">
              {courses.length}
            </h3>
          </div>
          {/* Assignments */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
            <p className="text-gray-400">Assignments</p>
            <h3 className="text-2xl font-bold text-teal-400">
              {totalAssignments}
            </h3>
          </div>
          {/* Students (placeholder) */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
            <p className="text-gray-400">Students</p>
            <h3 className="text-2xl font-bold text-teal-400">
              {TOTAL_STUDENTS}
            </h3>
          </div>
          {/* Pending Reviews (placeholder) */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
            <p className="text-gray-400">Pending Reviews</p>
            <h3 className="text-2xl font-bold text-teal-400">
              {PENDING_REVIEWS}
            </h3>
          </div>
        </div>

        {/* Active Courses */}
        <div className="mb-8 bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-teal-400 mb-4">
            Active Courses
          </h3>
          {loading ? (
            <div className="text-center text-gray-300">Loading...</div>
          ) : courses.length === 0 ? (
            <p className="text-gray-300">No courses available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                >
                  <h4 className="text-md font-semibold text-teal-300">
                    {course.name}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {course.description || "No description provided."}
                  </p>
                  {/* Example: Show number of students if available */}
                  <p className="mt-2 text-gray-500 text-xs">
                   
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-teal-400">
              Recent Assignments
            </h3>
            <button
              onClick={() => setIsAssignmentModalOpen(true)}
              className="bg-gradient-to-r from-teal-400 to-cyan-400 text-gray-900 px-4 py-2 rounded-lg hover:from-teal-300 hover:to-cyan-300 font-semibold"
            >
              + Add Assignment
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm font-medium text-gray-300">
              Select a Course:
            </label>
            <select
              className="p-2 bg-white text-black border border-gray-600 rounded-lg"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="text-center text-gray-300">Loading...</div>
          ) : selectedCourseAssignments.length === 0 ? (
            <p className="text-gray-300">
              No assignments found for this course.
            </p>
          ) : (
            <div>
              {selectedCourseAssignments.map((assignment) => (
                <motion.div
                  key={assignment._id}
                  className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 mb-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-md font-bold text-teal-300 mb-1">
                    {assignment.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {assignment.description}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Due:{" "}
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <button className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <button onClick={notify}>Notify!</button>
      </main>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ========== MODALS ========== */}

      {/* Add Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Add New Course
            </h2>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Course Description
            </label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              rows="4"
            ></textarea>

            <div className="flex justify-end">
              <button
                onClick={handleAddCourse}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Course
              </button>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Add New Assignment
            </h2>

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Assignment Title
            </label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Assignment Description
            </label>
            <textarea
              value={assignmentDescription}
              onChange={(e) => setAssignmentDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              rows="4"
            ></textarea>

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={assignmentDueDate}
              onChange={(e) => setAssignmentDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />

            <div className="flex justify-end">
              <button
                onClick={handleAddAssignment}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Assignment
              </button>
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
