import { legacy_createStore ,combineReducers,applyMiddleware} from 'redux'

import thunk from 'redux-thunk';

import {composeWithDevTools} from "redux-devtools-extension"
import { newReviewReducer, productDetailsReducer, productReducer } from './Reducers/Productreducer';
import { forgotPasswordReducer, profileReducer, userReducer } from './Reducers/UserReducer';
import { cartReducer } from './Reducers/CartReducer';
import {myOrdersReducer, newOrderReducer, orderDetailsReducer} from './Reducers/OrderReducer'

const reducer = combineReducers({
    products:productReducer,
    productDetails:productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
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