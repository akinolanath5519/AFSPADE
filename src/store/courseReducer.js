import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating a course
export const createCourse = createAsyncThunk(
  'course/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('http://localhost:5000/course', courseData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Example for token-based auth
        },
      });
      return data; // Return the created course data
    } catch (error) {
      console.error("Error creating course:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);



// Async thunk for enrolling in a course
export const enrollInCourse = createAsyncThunk(
  'course/enrollInCourse',
  async (courseId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Get token from Redux store
      const { data } = await axios.post(
        `http://localhost:5000/select/course/${courseId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token here
          },
        }
      );
      return data; // Return the updated course data
    } catch (error) {
      console.error("Error enrolling in course:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll in course');
    }
  }
);


// Async thunk for fetching all courses
export const fetchAllCourses = createAsyncThunk(
    'course/fetchAllCourses',
    async (_, { rejectWithValue, getState }) => {
      try {
        const token = getState().auth.token; // Get token from Redux store
        const { data } = await axios.get('http://localhost:5000/course', {
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass the token here
          },
        });
        return data.courses; // Return the list of courses
      } catch (error) {
        console.error("Error fetching all courses:", error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
      }
    }
  );
  

  //fetch all course for students
  export const fetchAllCoursesForStudent = createAsyncThunk(
    'course/fetchAllCourses',
    async (_, { rejectWithValue, getState }) => {
      try {
        const token = getState().auth.token; // Get token from Redux store
        const { data } = await axios.get('http://localhost:5000/student/course', {
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass the token here
          },
        });
        return data.courses; // Return the list of courses
      } catch (error) {
        console.error("Error fetching all courses:", error.response?.data?.message || error.message);
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
      }
    }
  );
  

// Async thunk for fetching a single course by ID
export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`http://localhost:3001/courses/${id}`);
      return data.course; // Return the course data
    } catch (error) {
      console.error("Error fetching course by ID:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

// Async thunk for deleting a course
export const deleteCourse = createAsyncThunk(
  'course/deleteCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`http://localhost:3001/courses/${courseId}`);
      return courseId; // Return the deleted course ID
    } catch (error) {
      console.error("Error deleting course:", error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

// Course reducer slice
export const courseReducer = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    course: null,
    loading: false,
    errorMessage: '',
    successMessage: '',
  },
  reducers: {
    resetCourseState: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
      state.course = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(createCourse.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload;
      })
      .addCase(createCourse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = 'Course created successfully';
        state.courses.push(payload); // Add new course to the list
      })
      
      // Handling fetch all courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(fetchAllCourses.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload;
      })
      .addCase(fetchAllCourses.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.courses = payload;
      })
      
      // Handling fetch single course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(fetchCourseById.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload;
      })
      .addCase(fetchCourseById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.course = payload;
      })
      
      // Handling delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(deleteCourse.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload;
      })
      .addCase(deleteCourse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = 'Course deleted successfully';
        state.courses = state.courses.filter(course => course._id !== payload); // Remove the deleted course from the list
      })

 // Handling enrollment in course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(enrollInCourse.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload;
      })
      .addCase(enrollInCourse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = 'Successfully enrolled in the course';
        state.course = payload; // Update the course state with the enrolled course
      });
  },
});

export const { resetCourseState } = courseReducer.actions;
export default courseReducer.reducer;
