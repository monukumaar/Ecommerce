import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword,loadUser } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from '../MetaData.jsx';
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (newPassword.length < 6) {
      setAlert({
        message: "New password must be at least 6 characters long",
        type: "error",
      });
      setTimeout(() => setAlert({ message: "", type: "" }), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({
        message: "New password and confirm password do not match",
        type: "error",
      });
      setTimeout(() => setAlert({ message: "", type: "" }), 3000);
      return;
    }

    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(myForm)); 
  };
  
  // This useEffect will run only once when the component mounts.
  // It resets the state so 'isUpdated' is always false on a fresh load.
  useEffect(() => {
    dispatch({ type: UPDATE_PASSWORD_RESET });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setAlert({ message: error, type: "error" });
      setTimeout(() => setAlert({ message: "", type: "" }), 3000);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      setAlert({ message: "Password Updated Successfully", type: "success" });
      navigate("/account", { state: { profileUpdated: true,message :"Password Updated Successfully",type:"success"} })
       dispatch({
              type: UPDATE_PASSWORD_RESET,
            });
    }
  }, [dispatch, error, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Change Password</h2>
              {alert.message && (
                <div
                  className={`alert ${alert.type === "error" ? "alert-error" : "alert-success"}`}
                  style={{
                    padding: "10px",
                    marginBottom: "10px",
                    backgroundColor: alert.type === "error" ? "#f8d7da" : "#d4edda",
                    color: alert.type === "error" ? "#721c24" : "#155724",
                    borderRadius: "4px",
                  }}
                >
                  {alert.message}
                </div>
              )}
              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="updatePasswordField">
                  <span>Old Password:</span>
                  <div className="inputWithIcon">
                    <span className="inputIcon">🔑</span>
                    <input
                      type="password"
                      placeholder="Old Password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="updatePasswordField">
                  <span>New Password:</span>
                  <div className="inputWithIcon">
                    <span className="inputIcon">🔓</span>
                    <input
                      type="password"
                      placeholder="New Password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="updatePasswordField">
                  <span>Confirm Password:</span>
                  <div className="inputWithIcon">
                    <span className="inputIcon">🔒</span>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="updatePasswordBtn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
