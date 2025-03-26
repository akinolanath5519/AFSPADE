import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import API_URL from '../config/api';
import { toast } from 'react-toastify';



// Create auth slice
const authReducer = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  setToken // Export the new action
} = authReducer.actions;

// Register thunk
export const register = (name, email, password, role) => async (dispatch) => {
  dispatch(registerStart());

  try {
    let endpoint = '';
    if (role === 'lecturer') {
      endpoint = `${API_URL}/register/lecturer`;
    } else if (role === 'admin') {
      endpoint = `${API_URL}/register/admin`;
    } else {
      endpoint = `${API_URL}/register/student`;
    }

    const response = await axios.post(endpoint, { name, email, password });

    if (response.status === 201) {
      dispatch(registerSuccess());
      dispatch(login(email, password)); // Auto-login after registration
      toast.success('Registration successful! Redirecting to your dashboard...');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(errorMessage));

    if (errorMessage.includes("already exists")) {
      toast.error(errorMessage);
    } else {
      toast.error('Registration failed. Please try again.');
    }
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch(loginStart());

  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    console.log('Login response:', response);  // Log the entire response

    if (response.status === 200) {
      // Directly extract user and token from response.data
      const { _id, name, email, role, token } = response.data;  // Adjusted destructuring

      // Log the user and token to verify
      console.log('User:', { _id, name, email, role });
      console.log('Token:', token);

      if (_id && token) {
        // If both user and token are present, dispatch loginSuccess
        dispatch(loginSuccess({
          user: { _id, name, email, role },
          token
        }));

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify({ _id, name, email, role }));
        localStorage.setItem('token', token);

        // Show success toast
        toast.success('Login successful! Welcome back.');
        return { _id, name, email, role };  // Return the user object for redirection
      } else {
        console.error('User or token is missing in response');
        dispatch(loginFailure('Invalid credentials or missing data'));
        toast.error('Invalid login credentials');
      }
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    toast.error('Login failed. Please try again.');
    console.error('Login error:', errorMessage);
  }
};



export default authReducer.reducer;
