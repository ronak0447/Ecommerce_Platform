import React, { Fragment,useRef, useEffect } from 'react';
import CheckoutSteps from './CheckoutSteps';
import {useSelector,useDispatch} from 'react-redux';
import Metadata from '../layout/Metadata';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { CreditCard,Event,VpnKey } from '@material-ui/icons';
import './Payment.css';
import { Typography } from '@mui/material';
import {useAlert} from 'react-alert';
import {useNavigate} from 'react-router-dom';
import {createOrder,clearErrors} from '../../Actions/OrderAction';


const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
  const {shippingInfo, cartItems} = useSelector((state)=>state.cart);
  const {user} = useSelector((state)=>state.user);
  const {error} = useSelector((state)=>state.newOrder);
//   const [] = useState();  
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const payBtn = useRef(null);  

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  }

  const order={
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };



  const submitHandler = async(e) => {
      e.preventDefault();
      
    payBtn.current.disabled=true;

    try {
        const config = {
            headers:{
                "Content-Type":"application/json",
            },
        };
        const {data} = await axios.post(
            "/api/payment/proccess",
            paymentData,
            config,
        );
        const client_secret = data.client_secret;

        if(!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(client_secret,{
            payment_method:{
                card: elements.getElement(CardNumberElement),
                billing_details:{
                    name: user.name,
                    email: user.email,
                    address:{
                        line1: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        postal_code: shippingInfo.pinCode,
                        country: shippingInfo.country,
                    },
                },
            },
        });    
        if(result.error){
            payBtn.current.disabled=false;
            alert.error(result.error.message);
        }else{
            if(result.paymentIntent.status === "succeeded"){
                order.paymentInfo={
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                };
                dispatch(createOrder(order));
                navigate("/success");
            }else{
                alert.error("There is some issue while proccessing payment");
            }
        }

    } catch (error) {
        payBtn.current.disabled = false;
        alert.error(error.response.data.message);

    }
  };
  
  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
  },[dispatch,error,alert])

  return (
    <Fragment>
        <Metadata title="Payment"/>
        <CheckoutSteps activeStep={2}/>
        <div className="paymentContainer">
            <form className="paymentForm" onSubmit={(e)=> submitHandler(e)}>
                <Typography>Card Info</Typography>
                <div>
                      <CreditCard/>
                      <CardNumberElement className="paymentInput"/>  
                </div>    
                <div>
                      <Event/>
                      <CardExpiryElement className="paymentInput"/>  
                </div>    
                <div>
                      <VpnKey/>
                      <CardCvcElement className="paymentInput"/>  
                </div>    
                <input 
                    type="submit"
                    value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                    ref={payBtn}
                    className="paymentFormBtn"
                />

            </form>
        </div>
    </Fragment>
  )
}

export default Payment
