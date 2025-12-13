import React, { Fragment, useEffect, useState } from "react";
import "./userList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MetaData from "../MetaData";
import Sidebar from "./Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { error, users } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector((state) => state.profile);
  const [notification, setNotification] = useState({ message: "", type: "" });

 console.log(users);
 

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (location.state?.userUpdated) {
      setNotification({ message: location.state?.message || "User Updated Successfully", type: "success" });
      setTimeout(() => {
        setNotification({ message: "", type: "" });
        navigate("/admin/users", { replace: true, state: {} });
      }, 3000);
    }
  }, [location.state, navigate]);


  // Fetch users on mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Handle errors and deletion notifications
  useEffect(() => {
    if (error) {
      setNotification({ message: `❌ ${error}`, type: "error" });
      dispatch(clearErrors());
    }

    if (deleteError) {
      setNotification({ message: `❌ ${deleteError}`, type: "error" });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      setNotification({ message: `✅ ${message}`, type: "success" });
      dispatch(getAllUsers()); // Refetch updated users list

      
        dispatch({ type: DELETE_USER_RESET });
    }
  }, [error, deleteError, isDeleted, message, dispatch]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.message]);

  return (
    <Fragment>
      <MetaData title="ALL USERS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="usersListContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <h1 id="usersListHeading">ALL USERS</h1>
          <table className="usersListTable">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.email}</td>
                    <td>{item.name}</td>
                    <td className={item.role === "admin" ? "greenColor" : "redColor"}>
                      {item.role}
                    </td>
                    <td>
                      <Link to={`/admin/user/${item._id}`} className="action-link">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteUserHandler(item._id)}
                        className="action-button delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
