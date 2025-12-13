import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";
import axios from "axios";

// Login
// export const login = (email, password) => async (dispatch) => {
//   try {
//     dispatch({ type: LOGIN_REQUEST });
//     console.log(email, password);

//     const config = { headers: { "Content-Type": "application/json" } };

//     const { data } = await axios.post(
//       `http://localhost:3000/api/v1/login`,
//       { email, password },
//       config
//     );
//     console.log(data);


//     dispatch({ type: LOGIN_SUCCESS, payload: data.user });
//   } catch (error) {
//     dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
//   }
// };

// In your userAction.js (modified)
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };

 const { data } = await axios.post(
      `http://localhost:3000/api/v1/login`,
      { email, password },
      config
    );

    // --- NEW LOGIC HERE ---
    if (!data.success) { // Assuming your backend sends { success: true/false, message: "..." }
      dispatch({ type: LOGIN_FAIL, payload: data.message });
     // console.log("Login/SignUp Error:", data.message); // For frontend logging
      return; // Stop further execution in this block
    }
    // --- END NEW LOGIC ---

    //console.log(data); // This will only log on successful login

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    // This catch block will now primarily handle network issues,
    // server errors (5xx), or other unexpected errors,
    // not "Invalid email or password" if your backend sends 200 for that.
    console.error("An unexpected error occurred during login:", error);
    dispatch({ type: LOGIN_FAIL, payload: "An unexpected error occurred." }); // Generic message
  }
};
// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } ,withCredentials: true }; //only if file
  // 
   // --- NEW: Add this loop to correctly log the FormData contents ---
    // console.log("FormData contents in userAction:");
    // for (let pair of userData.entries()) {
    //     console.log(pair[0] + ": " + pair[1]);
    // }
    // --- E
  //  const config = { withCredentials: true }; //only if base64
  //  console.log(config,userData);

     const { data } = await axios.post(`http://localhost:3000/api/v1/register`, userData,config);
    // console.log(data);
    

    // --- NEW LOGIC HERE ---
    if (!data.success) { // Assuming your backend sends { success: true/false, message: "..." }
      dispatch({ type: REGISTER_USER_FAIL, payload: data.message });
      console.log("Login/SignUp Error:", data.message); // For frontend logging
      return; // Stop further execution in this block
    }
    // --- END NEW LOGIC ---

    console.log(data); // This will only log on successful login
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {

    console.error("An unexpected error occurred during login:", error);
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Load User
// export const loadUser = () => async (dispatch) => {
//   try {
//     dispatch({ type: LOAD_USER_REQUEST });

//     const { data } = await axios.get(`http://localhost:3000/api/v1/me`);
//    console.log(data);

//     dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
//   } catch (error) {
//     dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
//   }
// };

// Load User (Get Current User Details)
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    // Assuming your backend has an endpoint like /api/v1/me to get the currently logged-in user
    // This typically relies on a cookie or token sent with the request.
    const { data } = await axios.get(`http://localhost:3000/api/v1/me`, { withCredentials: true });
 
    // If your backend also sends a success flag for this endpoint
    if (!data.success) {
      dispatch({ type: LOAD_USER_FAIL, payload: data.message });
      // console.log("Load User Error:", data.message);
      return;
    }

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    // This catch block handles network errors, 4xx/5xx responses, etc.
    console.error("An unexpected error occurred during user loading:", error);
    // Use optional chaining (?.) for safer access to error.response.data.message
    dispatch({ type: LOAD_USER_FAIL, payload: error.response?.data?.message || "An unexpected error occurred while loading user." });
  }
};


// Logout User
export const logout = () => async (dispatch) => {
  try {
    let c = await axios.get(`http://localhost:3000/api/v1/logout`, { withCredentials: true });


      console.log(c);

    dispatch({ type: LOGOUT_SUCCESS });
    return { success: true }; // <-- returning so it's awaitable

  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
  }
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = { headers: { "Content-Type": "application/json"  }, withCredentials: true };

    const { data } = await axios.put(`http://localhost:3000/api/v1/me/update`, userData, config);
    //console.log(data);
    

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    };

    const { data } = await axios.put(
      `http://localhost:3000/api/v1/password/update`,
      passwords,
      config
    );
    if (!data.success) {
      dispatch({
        type: UPDATE_PASSWORD_FAIL,
        payload: data.message || "Password update failed",
      });
    }

    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" },withCredentials:true };

    const { data } = await axios.post(`http://localhost:3000/api/v1/password/forgot`, email, config);
   
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
    
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" },withCredentials:true };

    const { data } = await axios.put(
      `http://localhost:3000/api/v1/password/reset/${token}`,
      passwords,
      config
    );
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get All Users admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const { data } = await axios.get(`http://localhost:3000/api/v1/admin/users`,{withCredentials:true});
   // console.log(data);
    

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ type: ALL_USERS_FAIL, payload: error.response.data.message });
  }
};

// get  User Details
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await axios.get(`http://localhost:3000/api/v1/admin/user/${id}`,{withCredentials:true});

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
  }
};

// Update User
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = { headers: { "Content-Type": "application/json" },
    withCredentials:true};
  //  console.log(userData);
    

    const { data } = await axios.put(
      `http://localhost:3000/api/v1/admin/user/${id}`,
      userData,
      config
    );
    

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete User
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axios.delete(`http://localhost:3000/api/v1/admin/user/${id}`,{withCredentials:true});
    console.log(data);
  
    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
