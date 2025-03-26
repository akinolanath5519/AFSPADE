import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllCoursesForStudent,
  enrollInCourse,
} from "../store/courseReducer";
import {
  fetchAssignmentsByCourse,
  sendMessage,
  fetchMessages,
} from "../store/assignmentReducer";
import { FaClipboard, FaBook, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// A simple Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-400"></div>
  </div>
);

const StudentDashboard = () => {
  const studentName = useSelector((state) => state.auth.user?.name);
  const token = useSelector((state) => state.auth.token);
  const courses = useSelector((state) => state.course.courses);
  const assignments = useSelector((state) => state.assignment.assignments);
  const messages = useSelector((state) => state.assignment.messages);
  const loadingCourses = useSelector((state) => state.course.loading);
  const loadingAssignments = useSelector((state) => state.assignment.loading);
  const errorMessage = useSelector((state) => state.course.errorMessage);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collapsedCourses, setCollapsedCourses] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState({}); // Holds file objects keyed by assignmentId
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state for assignment
  const [notifications, setNotifications] = useState([]);
  const [grades, setGrades] = useState({});
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");

  // Debug: Log messages whenever they change.
  useEffect(() => {
    console.log("Fetched messages:", messages);
    // Update grades based on messages
    const newGrades = {};
    messages.forEach((message) => {
      console.log("Processing message:", message);
      if (message.scores && message.scores.total && message.assignmentInstructions) {
        newGrades[message.assignmentInstructions] = message.scores.total;
      } else {
        console.log("Message missing scores or assignmentInstructions:", message);
      }
    });
    console.log("Updated grades:", newGrades);
    setGrades(newGrades);
  }, [messages]);

  // Redirect to login if token is missing
  useEffect(() => {
    const persistedToken = localStorage.getItem("token");
    if (!persistedToken) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch all courses for the student
  useEffect(() => {
    if (token) {
      dispatch(fetchAllCoursesForStudent());
    }
  }, [dispatch, token]);

  // Fetch assignments for each course
  useEffect(() => {
    if (courses.length) {
      courses.forEach((course) => {
        dispatch(fetchAssignmentsByCourse(course._id));
      });
    }
  }, [dispatch, courses]);

  // Set initial notifications
  useEffect(() => {
    setNotifications([
      { message: "Assignment 1 deadline approaching" },
      { message: "New course materials uploaded" },
    ]);
  }, []);

  // Fetch messages when the component mounts (or when token changes)
  useEffect(() => {
    if (token) {
      dispatch(fetchMessages());
    }
  }, [dispatch, token]);

  // Handle file selection for an assignment
  const handleFileChange = (courseId, assignmentId, event) => {
    const file = event.target.files[0];
    setSubmittedAssignments((prev) => ({
      ...prev,
      [assignmentId]: file,
    }));
  };

  // Handle assignment submission
  const handleSubmitAssignment = async (assignmentId) => {
    const file = submittedAssignments[assignmentId];
    if (!file) {
      toast.error("Please select a file before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("assignmentFile", file);

      // Dispatch sendMessage to submit the assignment
      await dispatch(sendMessage(formData)).unwrap();
      toast.success("Assignment submitted successfully!");
      // Clear the selected file after successful submission
      setSubmittedAssignments((prev) => ({ ...prev, [assignmentId]: null }));
      // Fetch messages after submission so they display in the Messages section
      dispatch(fetchMessages());
    } catch (error) {
      console.error("Assignment submission failed:", error);
      toast.error("Assignment submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle course enrollment
  const handleEnrollInCourse = (courseId) => {
    setEnrollingCourseId(courseId);
    dispatch(enrollInCourse(courseId))
      .then(() => {
        toast.success("Successfully enrolled in the course!");
        setEnrollingCourseId(null);
      })
      .catch((error) => {
        console.error("Enrollment failed:", error);
        toast.error("Enrollment failed. Please try again.");
        setEnrollingCourseId(null);
      });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-gray-800/90 backdrop-blur-sm p-6 border-r border-white/10">
        <h2 className="text-2xl font-semibold mb-6 text-teal-400">
          Dashboard Menu
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center py-2 px-4 hover:bg-gray-700/50 rounded transition duration-300 w-full text-left text-gray-300"
            >
              <FaHome className="mr-2 text-teal-400" /> Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView("assignments")}
              className="flex items-center py-2 px-4 hover:bg-gray-700/50 rounded transition duration-300 w-full text-left text-gray-300"
            >
              <FaClipboard className="mr-2 text-teal-400" /> Assignments
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView("enroll")}
              className="flex items-center py-2 px-4 hover:bg-gray-700/50 rounded transition duration-300 w-full text-left text-gray-300"
            >
              <FaBook className="mr-2 text-teal-400" /> Enroll for course
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
        {currentView === "dashboard" && (
          <>
           <h3 className="text-3xl mb-6 font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
  Welcome, {studentName || "Student"}!
</h3>
            {/* Grades Overview */}
            <div className="mb-8 bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-teal-400 mb-4">
                Your Grades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(grades).map(([courseName, grade]) => (
                  <div
                    key={courseName}
                    className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                  >
                    <h3 className="text-lg font-semibold text-teal-300">
                      {courseName}
                    </h3>
                    <p className="text-cyan-400 text-xl font-bold">{grade}%</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Notifications */}
            <div className="mb-8 bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-teal-400 mb-4">
                Notifications
              </h2>
              <ul className="space-y-3">
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="bg-white-700/30 p-4 rounded-lg border border-gray-600"
                  >
                    <p className="text-cyan-300">{notification.message}</p>
                  </li>
                ))}
              </ul>
            </div>
            {/* Messages */}
            <div className="mb-8 bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-teal-400 mb-4">
                Messages
              </h2>
              <ul className="space-y-3">
                {messages && messages.length > 0 ? (
                  messages.map((message, index) => (
                    <li
                      key={index}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 text-white"
                    >
                      {/* Use ReactMarkdown for proper message formatting */}
                      <ReactMarkdown
                        className="prose prose-invert text-white"
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {message.content || message.aiFeedback}
                      </ReactMarkdown>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">No messages available.</p>
                )}
              </ul>
            </div>
          </>
        )}

        {currentView === "assignments" && (
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-teal-400 mb-4">
              Assignments
            </h2>
            {loadingAssignments ? (
              <Spinner />
            ) : (
              assignments &&
              Object.keys(assignments).map((courseId) => (
                <div
                  key={courseId}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {assignments[courseId].map((assignment) => (
                    <div
                      key={assignment._id}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <h4 className="text-md font-bold text-teal-300 mb-1">
                        {assignment.title}
                      </h4>
                      <p className="text-gray-400">{assignment.description}</p>
                      <p className="text-gray-500">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        <input
                          type="file"
                          className="block mb-2 w-full p-2 bg-gray-600/20 border border-gray-500 rounded-lg text-gray-300"
                          onChange={(e) =>
                            handleFileChange(courseId, assignment._id, e)
                          }
                        />
                        <button
                          className="bg-gradient-to-r from-teal-400 to-cyan-400 text-gray-900 px-4 py-2 rounded-lg hover:from-teal-300 hover:to-cyan-300 w-full font-semibold"
                          onClick={() => handleSubmitAssignment(assignment._id)}
                          disabled={
                            !submittedAssignments[assignment._id] ||
                            isSubmitting
                          }
                        >
                          {isSubmitting ? "Submitting..." : "Submit Assignment"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {currentView === "enroll" && (
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-teal-400 mb-4">
              Enroll in Courses
            </h2>
            {loadingCourses ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-400">{errorMessage}</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 mb-4"
                >
                  <h3 className="text-lg font-bold text-teal-300 mb-2">
                    {course.name}
                  </h3>
                  <button
                    className="w-full text-left text-cyan-400 hover:text-cyan-300 mb-2"
                    onClick={() =>
                      setCollapsedCourses((prev) => ({
                        ...prev,
                        [course._id]: !prev[course._id],
                      }))
                    }
                  >
                    {collapsedCourses[course._id]
                      ? "Hide Details"
                      : "Show Details"}
                  </button>
                  {collapsedCourses[course._id] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assignments[course._id]?.map((assignment) => (
                        <div
                          key={assignment._id}
                          className="bg-gray-600/20 p-4 rounded-lg border border-gray-500"
                        >
                          <h4 className="text-md font-bold text-teal-300 mb-1">
                            {assignment.title}
                          </h4>
                          <p className="text-gray-400">
                            {assignment.description}
                          </p>
                          <p className="text-gray-500">
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className="mt-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-gray-900 px-4 py-2 rounded-lg hover:from-teal-300 hover:to-cyan-300 w-full font-semibold"
                    onClick={() => handleEnrollInCourse(course._id)}
                    disabled={enrollingCourseId === course._id}
                  >
                    {enrollingCourseId === course._id
                      ? "Enrolling..."
                      : "Enroll Now"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      {/* Toast Notifications Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentDashboard;