import React,{Fragment,useEffect} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './OrdersList.css';
import {useSelector,useDispatch} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import {Edit,Delete} from '@material-ui/icons';
import Sidebar from './Sidebar';
import { deleteOrder, getAllOrders ,clearErrors} from '../../Actions/OrderAction';
import { DELETE_ORDER_REST } from '../../Constants/OrderConstants';

const OrderList = () => {
  
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();  

  const {error,orders} = useSelector((state)=>state.allOrders);
  const {error:deleteError,isDeleted} = useSelector((state)=>state.order);

  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
    if(deleteError){
        alert.error(error);
        dispatch(clearErrors());
    }
    if(isDeleted){
        alert.success("Order Deleted Successfully");
        navigate("/admin/orders");
        dispatch({type: DELETE_ORDER_REST});
    }
    dispatch(getAllOrders());
  },[dispatch,error,alert,isDeleted,deleteError,navigate]) ; 

  const deleteOrderHandler =(id)=>{
    dispatch(deleteOrder(id))
  }

  const columns =[
    {
      field:"id",
      headerName:"Order ID",
      minwidth:150,
      flex:1,
  },
  {
      field:"status",
      headerName:"status",
      minwidth:150,
      flex:0.5,
      cellClassName: (params) => {
          return params.getValue(params.id,"status") === "Delivered"
          ? "greenColor"
          : "redColor";
      }
  },
  {
      field:"itemsQty",
      headerName:"items Qty",
      type:"number",
      minwidth:150,
      flex:0.5,
  },
  {
      field:"amount",
      headerName:"Amount",
      type:"number",
      minwidth:150,
      flex:0.5,
  },
    {
        field:"actions",
        headerName:"Actions",
        minwidth:150,
        type:"number",
        flex:0.3,
        sortable:false,
        renderCell:(params) =>{
            return(
                <Fragment>
                    <Link to={`/admin/order/${params.getValue(params.id,"id")}`}>
                        <Edit/>
                    </Link>

                    <Button onClick={()=>deleteOrderHandler(params.getValue(params.id,"id"))}>
                        <Delete/>
                    </Button>
                </Fragment>
            )
        },
    },

  ];
  const rows =[];

  orders && 
  orders.forEach((item)=>{
        rows.push({
            id:item._id,
            itemsQty:item.orderItems.length,
            amount:item.totalPrice,
            status:item.orderStatus,
        });
    });

  return (
        <Fragment>
            <Metadata title={`ALL ORDERS - Admin`}/>
            <div className="dashboard">
                <Sidebar/>
                <div className="productListContainer">
                    <h1 className="productListHeading">ALL ORDERS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='productListTable'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
  );
}

export default OrderList;
