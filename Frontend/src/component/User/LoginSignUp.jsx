import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction";
import validator from "validator";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // register state
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;

  // const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  const [avatar, setAvatar] = useState(null);

  // local errors
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // frontend validation errors
  const [frontendErrors, setFrontendErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loginSubmit = (e) => {
    e.preventDefault();
    setRegisterError(""); // clear register error

    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    setLoginError(""); // clear login error

    // frontend validation check before dispatch
    if (name.length < 4) {
      setFrontendErrors((prev) => ({
        ...prev,
        name: "Name should have more than 4 characters",
      }));
      return;
    }
    if (!validator.isEmail(email)) {
      setFrontendErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email",
      }));
      return;
    }
    if (password.length < 8) {
      setFrontendErrors((prev) => ({
        ...prev,
        password: "Password should be greater than 8 characters",
      }));
      return;
    }

    //   // if no frontend errors
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);


   // console.log(name, email);
    //console.log(user.name, user.email);


    // myForm.set("avatar", avatar);
    // Only include avatar if a file is selected (not the default string)
    if (avatar && avatar !== "/Profile.png") {
      myForm.append("avatar", avatar); // Use append for files
     // console.log(avatar);
    }
    
    //   // Important: file ko append karo
    //   console.log(avatar);
    //  console.log("FormData contents:");
    //   for (let pair of myForm.entries()) {
    //       console.log(pair[0] + ": " + pair[1]);
    //   }



    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          //   setAvatar(reader.result);// for base64 
          setAvatar(e.target.files[0]);// for file  
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
      // frontend validations live
      if (e.target.name === "name") {
        if (e.target.value.length < 4) {
          setFrontendErrors((prev) => ({
            ...prev,
            name: "Name should have more than 4 characters",
          }));
        } else if (e.target.value.length > 30) {
          setFrontendErrors((prev) => ({
            ...prev,
            name: "Name cannot exceed 30 characters",
          }));
        } else {
          setFrontendErrors((prev) => ({ ...prev, name: "" }));
        }
      }

      if (e.target.name === "email") {
        if (!validator.isEmail(e.target.value)) {
          setFrontendErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email",
          }));
        } else {
          setFrontendErrors((prev) => ({ ...prev, email: "" }));
        }
      }

      if (e.target.name === "password") {
        if (e.target.value.length < 8) {
          setFrontendErrors((prev) => ({
            ...prev,
            password: "Password should be greater than 8 characters",
          }));
        } else {
          setFrontendErrors((prev) => ({ ...prev, password: "" }));
        }
      }
    }
  };

  useEffect(() => {
    if (error) {
      if (error.includes("Invalid")) {
        setLoginError(error);

      } else {
        setRegisterError(error);
      }
      const timeout = setTimeout(() => {
        dispatch(clearErrors());

        setLoginError("");
        setRegisterError("");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  const switchTabs = (e, tab) => {
    if (e) e.preventDefault();
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    } else if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");
      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>

              {/* ---------------- Login Form ---------------- */}
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                {loginError && (
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {loginError}
                  </p>
                )}
                <div className="loginEmail">
                  <span>📧</span>
                  <input
                    id="loginEmail"
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <span>🔒</span>
                  <input
                    id="loginPassword"
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              {/* ---------------- Register Form ---------------- */}
              <form
                className="signUpForm"
                ref={registerTab}
                //  encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                {registerError && (
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {registerError}
                  </p>
                )}
                <div className="signUpName">
                  <span>👤</span>
                  <input
                    id="signUpName"
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                {frontendErrors.name && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {frontendErrors.name}
                  </p>
                )}

                <div className="signUpEmail">
                  <span>📧</span>
                  <input
                    id="signUpEmail"
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                {frontendErrors.email && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {frontendErrors.email}
                  </p>
                )}

                <div className="signUpPassword">
                  <span>🔒</span>
                  <input
                    id="signUpPassword"
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>
                {frontendErrors.password && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {frontendErrors.password}
                  </p>
                )}

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
