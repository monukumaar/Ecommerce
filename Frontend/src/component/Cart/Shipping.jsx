import React, { useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../MetaData.jsx";
import { Country, State } from "country-state-city";   // ✅ Correct import
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps.jsx";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);

  console.log(shippingInfo);
  

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const shippingSubmit = () => {
    if (!address || !city || !pinCode || !phoneNo || !country || !state) {
      setAlertMessage("Please fill in all required fields");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      return;
    }

    if (phoneNo.length !== 10) {
      setAlertMessage("Phone Number should be 10 digits long");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      return;
    }

    dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo }));
    setAlertMessage("Shipping information saved successfully");
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
      navigate("/order/confirm");
    }, 2000);
  };

  return (
    <>
      <MetaData title="Shipping Details" />
      <CheckoutSteps activeStep={0} />
      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>
          {alertMessage && (
            <div className={`alert ${alertType === "error" ? "alert-error" : "alert-success"}`}>
              {alertMessage}
            </div>
          )}
          <div className="shippingForm">
            <div>
              <span>🏠</span>
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <span>🏙️</span>
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <span>📍</span>
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            <div>
              <span>📞</span>
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>
            <div>
              <span>🌍</span>
              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {country && (
              <div>
                <span>🏞️</span>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State.getStatesOfCountry(country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              type="button"
              className="shippingBtn"
              onClick={shippingSubmit}
              disabled={!state}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;
