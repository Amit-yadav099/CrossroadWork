import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../../services/api';

// Async thunks for API operations
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersApi.createUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await usersApi.updateUser(id, userData);
      return { id, ...userData };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentUser: null,
  stats: {
    total: 0,
    active: 0,
    pending: 0,
    companies: 0
  }
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Local CRUD operations (for demo when API is unavailable)
    addUser: (state, action) => {
      const newUser = {
        id: state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 1,
        ...action.payload,
      };
      state.users.push(newUser);
    },
    
    editUser: (state, action) => {
      const { id, ...updatedData } = action.payload;
      const index = state.users.findIndex(user => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...updatedData };
      }
    },
    
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
    
    // Create User
    .addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      // Note: JSONPlaceholder returns the new user with id 11 always
      // So we'll generate a unique ID locally
      const newUser = {
        ...action.payload,
        id: state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 1,
      };
      state.users.push(newUser);
    })
    .addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create user';
    })
    
    // Update User
    .addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update user';
    })
    
    // Delete User
    .addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter(user => user.id !== action.payload);
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to delete user';
    });
  },
});

export const { 
  addUser, 
  editUser, 
  removeUser, 
  setCurrentUser, 
  clearCurrentUser,
  clearError 
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, userId) => 
  state.users.users.find(user => user.id === userId);
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;
export const selectCurrentUser = (state) => state.users.currentUser;