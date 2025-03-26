import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_URL from '../config/api'; 
// Async thunk for creating an assignment

export const createAssignment = createAsyncThunk(
  'assignment/createAssignment',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/assignment`, assignmentData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error creating assignment:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create assignment');
    }
  }
);

// Async thunk for fetching assignments by course
export const fetchAssignmentsByCourse = createAsyncThunk(
  'assignment/fetchAssignmentsByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/assignment/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching assignments by course:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }
);

// Async thunk for sending a message (submitting assignment for AI grading)
// This thunk expects submissionData containing at least assignmentId and either studentCode or an uploaded file.
export const sendMessage = createAsyncThunk(
  'assignment/sendMessage',
  async (submissionData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/chat`, submissionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Note: When using file upload via form-data, let Postman set the Content-Type automatically.
        },
      });
      return data;
    } catch (error) {
      console.error("Error sending message:", error.response?.data?.error || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to grade the assignment.');
    }
  }
);




// Async thunk for fetching messages for the authenticated student
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Initial state for the assignment slice
const initialState = {
  assignments: {},  // Keyed by course ID
  assignment: null,
  chatMessage: null, // Will store the result from sendMessage (e.g., AI feedback and scores)
  messages: [], // Will store the fetched messages
  loading: false,
  errorMessage: '',
  successMessage: '',
};

// The assignment slice, with reducers and extraReducers for handling async thunks
export const assignmentReducer = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    resetAssignmentState: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
      state.assignment = null;
      state.chatMessage = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Assignment Thunk
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(createAssignment.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Store assignment by course ID (push to array)
        if (!state.assignments[payload.course._id]) {
          state.assignments[payload.course._id] = [];
        }
        state.assignments[payload.course._id].push(payload);
        state.successMessage = 'Assignment added successfully';
      })
      .addCase(createAssignment.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload || 'Failed to create assignment';
      })

      // Fetch Assignments by Course Thunk
      .addCase(fetchAssignmentsByCourse.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(fetchAssignmentsByCourse.fulfilled, (state, { payload, meta }) => {
        state.loading = false;
        // meta.arg is the courseId passed to the thunk
        state.assignments[meta.arg] = payload;
      })
      .addCase(fetchAssignmentsByCourse.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload || 'Failed to fetch assignments';
      })

      // Send Message (Submit Assignment) Thunk
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(sendMessage.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Assume payload.result contains the graded submission (student, feedback, scores)
        state.chatMessage = payload.result;
        state.successMessage = 'Assignment graded successfully';
      })
      .addCase(sendMessage.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload || 'Failed to grade the assignment.';
      })

      // Fetch Messages Thunk
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(fetchMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.messages = payload.messages;
        state.successMessage = 'Messages fetched successfully';
      })
      .addCase(fetchMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload || 'Failed to fetch messages';
      });
  },
});

export const { resetAssignmentState } = assignmentReducer.actions;
export default assignmentReducer.reducer;