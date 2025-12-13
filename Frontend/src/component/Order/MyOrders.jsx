import React, { useEffect, useState } from "react";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import MetaData from "../MetaData.jsx";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

 // console.log(orders);
  


  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.3,
    },
  ];

  const rows = orders
    ? orders.map((item) => ({
      itemsQty: item.orderItems.length,
      id: item._id,
      status: item.orderStatus,
      amount: item.totalPrice,
    }))
    : [];

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error]);

  return (
    <>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          {alertMessage && (
            <div
              className={`alert ${alertType === "error" ? "alert-error" : "alert-success"}`}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: alertType === "error" ? "#f8d7da" : "#d4edda",
                color: alertType === "error" ? "#721c24" : "#155724",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              {alertMessage}
            </div>
          )}
          <h2 id="myOrdersHeading">{user.name}'s Orders</h2>
          <div className="ordersTable" style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.field}
                      style={{
                        minWidth: column.minWidth,
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{row.id}</td>
                      <td
                        style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                        className={row.status === "Delivered" ? "greenColor" : "redColor"}
                      >
                        {row.status}
                      </td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{row.itemsQty}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{row.amount}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/order/${row.id}`)}
                        >
                          🔗
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#666",
                        fontStyle: "italic",
                      }}
                    >
                      🚫 No Orders Found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;