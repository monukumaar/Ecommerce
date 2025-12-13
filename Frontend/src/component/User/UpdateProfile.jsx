import React, { Fragment, useState, useEffect } from 'react';
import './UpdateProfile.css';
import Loader from '../layout/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updateProfile, loadUser } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../MetaData.jsx';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png');
  const [alert, setAlert] = useState({ message: '', type: '' });

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    if (avatar) {
      myForm.set('avatar', avatar);
    }
    dispatch(updateProfile(myForm));
  };

  const updateProfileDataChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
   // console.log('isUpdated on mount:', isUpdated);

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarPreview(user.avatar?.url || '/Profile.png');
    }

    if (error) {
      setAlert({ message: error, type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      dispatch(loadUser());
      navigate('/account', { state: { profileUpdated: true,message :"Profile  Updated Successfully",type:"success" } }); // Pass state to Profile.js
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, user, isUpdated, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>
              {alert.message && (
                <div
                  className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: alert.type === 'error' ? '#f8d7da' : '#d4edda',
                    color: alert.type === 'error' ? '#721c24' : '#155724',
                    borderRadius: '4px',
                  }}
                >
                  {alert.message}
                </div>
              )}
              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <span>Name:</span>
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <span>Email:</span>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <button type="submit" className="updateProfileBtn">
                  Update
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;