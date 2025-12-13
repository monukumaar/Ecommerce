import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../actions/userAction";
import MetaData from "../MetaData.jsx";
import Loader from "../layout/Loader/Loader";
import './ForgotPassword.css'

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const handleForgotPassword = () => {
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertType("error");
      dispatch(clearErrors());
    }
    if (message) {
     setAlertMessage(message);
      setAlertType("success");  
      setTimeout(() => {
        setAlertMessage("");
      setAlertType("");  
            // Clear location state to prevent re-showing message on refresh
      }, 5000);
    }
  }, [dispatch, error, message]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Forgot Password" />
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>
              <div className="forgotPasswordForm">
                <div className="forgotPasswordEmail">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="forgotPasswordBtn"
                  onClick={handleForgotPassword}
                >
                  Send
                </button>
                {alertMessage && (
                  <div
                    className={`alert ${alertType === "error" ? "alert-error" : "alert-success"
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

export default ForgotPassword;