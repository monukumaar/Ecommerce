import React, { useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import MetaData from "../MetaData.jsx";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  
  const handleResetPassword = () => {
    // Client-side validation
    if (password.length < 8) {
      setAlertMessage("New password must be at least 8 characters long");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("New password and confirm password do not match");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      return;
    }

    const myForm = new FormData();
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, myForm));
  };

 useEffect(() => {
  if (error) {
    setAlertMessage(error);
    setAlertType("error");
    dispatch(clearErrors());
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  }

  if (success) {
    setAlertMessage("Password Updated Successfully");
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
      navigate("/login");   // navigate inside timeout (UX better lagta hai)
    }, 1000); // chhota delay so user dekh sake message
  }
}, [dispatch, error, success, navigate]);


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Reset Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Reset Password</h2>
              <div className="resetPasswordForm">
                <div className="resetPasswordField">
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="resetPasswordField">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="resetPasswordBtn"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                {alertMessage && (
                  <div
                    className={`alert ${
                      alertType === "error" ? "alert-error" : "alert-success"
                    }`}
                  >
                    {alertMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;