// import { createStore, combineReducers, applyMiddleware } from "redux";
// import { configureStore } from '@reduxjs/toolkit';

// import {thunk} from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";

// import {
//   newProductReducer,
//   newReviewReducer,
//   productDetailsReducer,
//   productReducer,
//   productReviewsReducer,
//   productsReducer,
//   reviewReducer,
// } from "./reducers/productReducer";

// import {
//   allUsersReducer,
//   forgotPasswordReducer,
//   profileReducer,
//   userDetailsReducer,
//   userReducer,
// } from "./reducers/userReducer";

// import { cartReducer } from "./reducers/cartReducer";
// import {
//   allOrdersReducer,
//   myOrdersReducer,
//   newOrderReducer,
//   orderDetailsReducer,
//   orderReducer,
// } from "./reducers/orderReducer";

// const reducer = combineReducers({
//   products: productsReducer,
//   productDetails: productDetailsReducer,
//   user: userReducer,
//   profile: profileReducer,
//   forgotPassword: forgotPasswordReducer,
//   cart: cartReducer,
//   newOrder: newOrderReducer,
//   myOrders: myOrdersReducer,
//   orderDetails: orderDetailsReducer,
//   newReview: newReviewReducer,
//   newProduct: newProductReducer,
//   product: productReducer,
//   allOrders: allOrdersReducer,
//   order: orderReducer,
//   allUsers: allUsersReducer,
//   userDetails: userDetailsReducer,
//   productReviews: productReviewsReducer,
//   review: reviewReducer,
// });

// let initialState = {
//   cart: {
//     cartItems: localStorage.getItem("cartItems")
//       ? JSON.parse(localStorage.getItem("cartItems"))
//       : [],
//     shippingInfo: localStorage.getItem("shippingInfo")
//       ? JSON.parse(localStorage.getItem("shippingInfo"))
//       : {},
//   },
// };

// const middleware = [thunk];

// const store = configureStore({
//   reducer,
//   initialState,
//   devTools: true // ✅ Enables Redux DevTools automatically
// });

// export default store;


import { configureStore } from '@reduxjs/toolkit';
import {
  newProductReducer,
  newReviewReducer,
  productDetailsReducer,
  productReducer,
  productReviewsReducer,
  productsReducer,
  reviewReducer,
} from './reducers/productReducer';
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
} from './reducers/orderReducer';

const reducer = {
  products: productsReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  product: productReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,
};

const preloadedState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  },
};

const store = configureStore({
  reducer,
  preloadedState,
  devTools: true, // Enable DevTools only in development
});

export default store;