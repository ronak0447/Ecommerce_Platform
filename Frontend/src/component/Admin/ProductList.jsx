import React,{Fragment,useEffect} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './ProductList.css';
import {useSelector,useDispatch} from 'react-redux';
import {clearErrors,getAdminProduct,deleteProduct} from '../../Actions/ProductAction';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import {Edit,Delete} from '@material-ui/icons';
import Sidebar from './Sidebar';
import { DELETE_PRODUCT_RESET } from '../../Constants/Productconstants';

const ProductList = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();  

  const {error,products} = useSelector((state)=>state.products);
  const {error:deleteError,isDeleted} = useSelector((state)=>state.product);

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
        alert.success("Product Deleted Successfully");
        navigate("/admin/dashboard");
        dispatch({type: DELETE_PRODUCT_RESET});
    }
    dispatch(getAdminProduct());
  },[dispatch,error,alert,isDeleted,deleteError,navigate]) ; 

  const deleteProductHandler =(id)=>{
    dispatch(deleteProduct(id))
  }

  const columns =[
    {field:"id",headerName:"Product ID",minwidth:200,flex:0.5},
    {
        field:"name",
        headerName:"Name",
        minwidth:350,
        flex:1,
    },
    {
        field:"stock",
        headerName:"Stock",
        minwidth:150,
        flex:0.3,
    },
    {
        field:"price",
        headerName:"Price",
        minwidth:150,
        type:"number",
        flex:0.3,
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
                    <Link to={`/admin/product/${params.getValue(params.id,"id")}`}>
                        <Edit/>
                    </Link>

                    <Button onClick={()=>deleteProductHandler(params.getValue(params.id,"id"))}>
                        <Delete/>
                    </Button>
                </Fragment>
            )
        },
    },

  ];
  const rows =[];

  products && 
    products.forEach((item)=>{
        rows.push({
            id:item._id,
            stock:item.Stock,
            price:item.price,
            name:item.name,
        });
    });

  return (
        <Fragment>
            <Metadata title={`ALL PRODUCTS - Admin`}/>
            <div className="dashboard">
                <Sidebar/>
                <div className="productListContainer">
                    <h1 className="productListHeading">ALL PRODUCTS</h1>

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
};

export default ProductList
