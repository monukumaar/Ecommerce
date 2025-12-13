import React, { Fragment, useEffect, useState } from "react";
import "./updateUser.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../MetaData"; // Adjusted to match other components
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import { FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { loading: updateLoading, error: updateError, isUpdated } = useSelector((state) => state.profile); // Confirm if state.profile is correct
  const { user: authUser } = useSelector((state) => state.user); // For auth check
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  

  useEffect(() => {
    // Optional auth check
    if (!authUser || authUser.role !== "admin") {
      navigate("/login");
      return;
    }

    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    } else if (!loading && !user) {
      setNotification({ message: "❌ User not found", type: "error" });
    }

    if (error) {
      setNotification({ message: `❌ ${error}`, type: "error" });
      dispatch(clearErrors());
    }

    if (updateError) {
      setNotification({ message: `❌ ${updateError}`, type: "error" });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      navigate("/admin/users",{ state: { userUpdated: true,message :"User Updated Successfully"} });
      dispatch({ type: UPDATE_USER_RESET });
    }

    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error, updateError, isUpdated, navigate, user, userId, notification.message, authUser]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
  
    if (!name || !email || !role) {
      setNotification({ message: "❌ Please fill all fields", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setNotification({ message: "❌ Invalid email format", type: "error" });
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);
    
    dispatch(updateUser(userId, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Update User - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="updateUserContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          {loading ? (
            <Loader />
          ) : !user ? (
            <h2 className="errorMessage">User not found</h2>
          ) : (
            <form className="updateUserForm" onSubmit={updateUserSubmitHandler}>
              <h1>Update User</h1>
              <div className="input-group">
                <FaUser />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <FaShieldAlt />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button
                id="updateUserBtn"
                type="submit"
                disabled={updateLoading || !role}
                className={updateLoading || !role ? "disabled" : ""}
              >
                Update
              </button>
              
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;