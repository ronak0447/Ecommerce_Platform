import { legacy_createStore ,combineReducers,applyMiddleware} from 'redux'

import thunk from 'redux-thunk';

import {composeWithDevTools} from "redux-devtools-extension"
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducer } from './Reducers/Productreducer';
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from './Reducers/UserReducer';
import { cartReducer } from './Reducers/CartReducer';
import {allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer} from './Reducers/OrderReducer'

const reducer = combineReducers({
    products:productsReducer,
    productDetails:productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    newProduct:newProductReducer,
    product:productReducer,
    allOrders:allOrdersReducer,
    order:orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
});

let initialSate={
    cart: {
        cartItems: localStorage.getItem("cartItems")
         ? JSON.parse(localStorage.getItem("cartItems"))
         :[],
         shippingInfo:localStorage.getItem("shippingInfo")
         ? JSON.parse(localStorage.getItem("shippingInfo"))
         :[],
    }
};

const middleware = [thunk];

const store = legacy_createStore(
    reducer,
    initialSate,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;