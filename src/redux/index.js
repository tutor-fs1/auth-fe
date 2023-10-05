import { configureStore } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '../helpers/fetch-wrapper';
import { history } from '../helpers/history';

// create slice
const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });
// exports
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;
// implementation
function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    error: null
  }
}
function createReducers() {
  return {
    logout
  };
  function logout(state) {
    state.user = null;
    localStorage.removeItem('user');
    history.navigate('/login');
  }
}

function createExtraActions() {
  const baseUrl = `http://localhost:5000`;
  return {
    login: login(),
    register: register()
  };
  function login() {
    return createAsyncThunk(
      `${name}/login`,
      async ({ email, pass }) => await fetchWrapper.post(`${baseUrl}/login`, { email, pass })
    );
  };
  function register() {
    return createAsyncThunk(
      `${name}/register`,
      async ({ email, pass }) => await fetchWrapper.post(`${baseUrl}/register`, { email, pass })
    );
  }

}

function createExtraReducers() {
  return {
    ...login()
  };
  function login() {
    var { pending, fulfilled, rejected } = extraActions.login;
    var { pending: pendingRegister, fulfilled: fulfilledRegister, rejected: rejectedRegister } = extraActions.register;
    const loginActions = {
      [pending]: (state) => {
        state.error = null;
      },
      [pendingRegister]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const user = action.payload;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;
        // get return url from location state or default to home page
        const { from } = history.location.state || { from: { pathname: '/' } };
        history.navigate(from);
      }
    }

    const registerActions = {
      [fulfilledRegister]: (state, action) => {
        const user = action.payload;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;
        // get return url from location state or default to home page
        const { from } = history.location.state || { from: { pathname: '/' } };
        history.navigate('/login');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
      },
      [rejectedRegister]: (state, action) => {
        state.error = action.error;
      }
    };
    return {
      ...loginActions,
      ...registerActions
    }
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});