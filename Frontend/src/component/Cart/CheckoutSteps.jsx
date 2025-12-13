import React from "react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  
  const steps = [
    {
      label: "Shipping Details",
      icon: "🚚",
    },
    {
      label: "Confirm Order",
      icon: "✅",
    },
    {
      label: "Payment",
      icon: "💳",
    },
  ];

  return (
    <>
      <div className="checkoutSteps" style={{ display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
        <ul style={{ display: "flex", listStyle: "none", padding: 0, width: "100%", maxWidth: "600px", justifyContent: "space-between" }}>
          {steps.map((item, index) => (
            <li
              key={index}
              className={`step ${activeStep === index ? "stepActive" : ""} ${
                activeStep >= index ? "stepCompleted" : ""
              }`}
              style={{
                flex: 1,
                textAlign: "center",
                color: activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)",
                fontWeight: activeStep === index ? "bold" : "normal",
                position: "relative",
              }}
            >
              <span className="stepIcon">{item.icon}</span>
              <span className="stepLabel">{item.label}</span>
              {index < steps.length - 1 && (
                <div
                  className="stepConnector"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-50%",
                    width: "100%",
                    height: "2px",
                    backgroundColor: activeStep > index ? "tomato" : "rgba(0, 0, 0, 0.2)",
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CheckoutSteps;