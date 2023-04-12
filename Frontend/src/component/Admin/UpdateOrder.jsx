import React, { Fragment,useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import Metadata from '../layout/Metadata';
import { Link, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './UpdateOrder.css'
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import {getOrderDetails,clearErrors, updateOrder} from '../../Actions/OrderAction';
import { AccountTree } from '@material-ui/icons';
import { Button } from '@mui/material';
import { UPDATE_ORDER_REST } from '../../Constants/OrderConstants';


const UpdateOrder = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {id} = useParams();
    const {order,error,loading} = useSelector((state)=>state.orderDetails);
    const {error:updateError,isUpdated} = useSelector((state)=>state.order);
    const [status,setStatus] = useState("");


    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(updateError){
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if(isUpdated){
            alert.success("Order Updated Successfully ");
            dispatch({type:UPDATE_ORDER_REST});
        }
        dispatch(getOrderDetails(id));
      },[dispatch,error,alert,id,updateError,isUpdated]);


    const updateOrderHandler = (e) =>{
        e.preventDefault();
  
        let myForm = new FormData();
    
        myForm.set("status",status);

    
    
        dispatch(updateOrder(id,myForm));
    }

  return (
    <Fragment>
    <Metadata title="Update Product"/>
    <div className="dashboard">
      <Sidebar/>
      <div className="newProductContainer">
        {loading ? 
        (<Loader/>
        ):(
            <div className="confirmOrderPage"
            style={{
                display:
                order.orderStatus === "Delivered" ? "block" : "grid",
            }}>
             <div>
                 <div className="confirmshippingArea">
                     <Typography>Shipping Info</Typography>
                     <div className="orderDetailsContainerBox">
                                <div>
                                    <p>Name:</p>
                                    <span>{order.user && order.user.name}</span>
                                </div>
                                <div>
                                    <p>Phone:</p>
                                    <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                                </div>
                                <div>
                                    <p>Address:</p>
                                    <span>{order.shippingInfo && 
                                             `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, 
                                             ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                                </div>
                            </div>
                     <Typography>Payment</Typography>
                            <div className="orderDetailsContainerBox">
                                <div>
                                    <p
                                      className={
                                        order.paymentInfo &&
                                        order.paymentInfo.status === "succeeded"
                                          ? "greenColor" : "redColor"
                                      }  
                                    >
                                        {
                                        order.paymentInfo &&
                                        order.paymentInfo.status === "succeeded"
                                          ? "PAID" : "NOT PAID"
                                      } 
                                    </p>
                                </div>
                                <div>
                                    <p>Amount</p>
                                    <span>{order.totalPrice && order.totalPrice}</span>
                                </div>
                            </div>
                            <Typography>Order Status</Typography>
                            <div className="orderDetailsContainerBox">
                                <div>
                                    <p
                                     className={
                                        order.orderStatus &&
                                        order.orderStatus === "Delivered"
                                          ? "greenColor" : "redColor"
                                      } 
                                    >
                                        {order.orderStatus && order.orderStatus}
                                    </p>
                                </div>
                            </div>
                 </div>   
                 <div className="confirmCartItems">
                     <Typography>Your Cart Items:</Typography>
                     <div className="confirmCartItemsContainer">
                         {order.orderItems &&
                          order.orderItems.map((item)=>(
                             <div key={item.product}>
                                 <img src={item.image.url} alt="Product" />
                                 <Link to={`/product/${item.product}`}>
                                     {item.name}
                                 </Link>
                                 <span>
                                     {item.quantity} × ₹{item.price}=
                                     <b>₹{item.price * item.quantity}</b>
                                 </span>
                             </div>
                          ))}
                     </div>
                 </div> 
             </div>
             {/* / */}
             <div
                style={{
                    display:
                    order.orderStatus === "Delivered" ? "none" : "block",
                }}
             >
             <form 
                className="updateOrderForm"
                encType='multipart/form-data'
                onSubmit={updateOrderHandler}
              >
                <h1>Update Order</h1>
                <div>
                  <AccountTree/>
                  <select onChange={(e)=>setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {order.orderStatus==="Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}
                      {order.orderStatus==="Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                  </select>
                </div>
                <Button
                  id='createProductBtn'
                  type='submit'
                  disabled={loading ? true : false || status===""? true:false}
                >
                  Update Order
                </Button>
  
              </form>          
             </div>
         </div>
        )}
      </div>
    </div>
</Fragment>
   
  )
}

export default UpdateOrder
