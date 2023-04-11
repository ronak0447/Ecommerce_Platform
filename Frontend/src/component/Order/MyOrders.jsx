import React ,{Fragment,useEffect}from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './MyOrders.css';
import {useSelector,useDispatch} from 'react-redux';
import {clearErrors,myOrders} from '../../Actions/OrderAction';
import Loader from '../layout/Loader/Loader';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Typography } from '@mui/material';
import Metadata from '../layout/Metadata';
import { Launch } from '@material-ui/icons';

const MyOrders = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {loading,error,orders} = useSelector((state)=>state.myOrders);
    const {user} = useSelector((state)=>state.user);
    const columns = [
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
            flex:0.3,
            headerName:"Actions",
            minwidth:150,
            type:"number",
            sortable:false,
            renderCell:(params)=>{
                return(
                    <Link to={`/order/${params.getValue(params.id,"id")}`}>
                        <Launch/>
                    </Link>
                )
            },
        },
    ];
    const rows = [];

    orders &&
    orders.forEach((item,index) => {
        rows.push({
            itemsQty:item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice,
        });
    });


    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(myOrders());
    },[dispatch,error,alert]);

  return (
     <Fragment>
         <Metadata title={`${user.name} - Orders`}/>   

         {loading? (
            <Loader/>
         ):(
            <div className="myOrdersPage">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableRowSelectionOnClick
                    className='myOrdersTable'
                    autoHeight
                />
                <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>

            </div>
         )}
     </Fragment>
  )
}

export default MyOrders;
