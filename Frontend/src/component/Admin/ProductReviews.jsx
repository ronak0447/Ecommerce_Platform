import React,{Fragment,useEffect, useState} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './ProductReviews.css';
import {useSelector,useDispatch} from 'react-redux';
import {clearErrors,getAllReviews,deleteReviews} from '../../Actions/ProductAction';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import {Delete,Star} from '@material-ui/icons';
import Sidebar from './Sidebar';
import { DELETE_REVIEW_RESET } from '../../Constants/Productconstants';


const ProductReviews = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();  
  
    const {error:deleteError,isDeleted} = useSelector((state)=>state.Reviews);
    const {error,reviews,loading} = useSelector((state)=>state.productReviews);
    
    const [productId,setProductId] = useState("");

    useEffect(()=>{
      if(productId.length=== 24){
        dispatch(getAllReviews(productId));
      }
      if(error){
          alert.error(error);
          dispatch(clearErrors());
      }
      if(deleteError){
          alert.error(error);
          dispatch(clearErrors());
      }
      if(isDeleted){
          alert.success("Reviews Deleted Successfully");
          navigate("/admin/reviews");
          dispatch({type: DELETE_REVIEW_RESET});
      }
    },[dispatch,error,alert,isDeleted,deleteError,navigate,productId]) ; 
  
    const deleteReviewHandler =(reviewId)=>{
      dispatch(deleteReviews(reviewId,productId))
    }
    const productReviewSubmitHandler = (e)=>{
        e.preventDefault();
        dispatch(getAllReviews(productId));
    }
  
    const columns =[
      {field:"id",headerName:"Review ID",minwidth:200,flex:0.5},
      {
          field:"user",
          headerName:"User",
          minwidth:150,
          flex:0.3,
      },
      {
          field:"comment",
          headerName:"Comment",
          minwidth:350,
          flex:1,
      },
      {
          field:"rating",
          headerName:"Rating",
          minwidth:150,
          type:"number",
          flex:0.3,
          cellClassName: (params) => {
            return params.getValue(params.id,"rating") > 3
            ? "greenColor"
            : "redColor";
        }
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
                      <Button onClick={()=>deleteReviewHandler(params.getValue(params.id,"id"))}>
                          <Delete/>
                      </Button>
                  </Fragment>
              )
          },
      },
  
    ];
    const rows =[];
  
    reviews && 
      reviews.forEach((item)=>{
          rows.push({
              id:item._id,
              rating:item.rating,
              comment:item.comment,
              user:item.name,
          });
      });
  
    return (
          <Fragment>
              <Metadata title={`ALL REVIEWS - Admin`}/>
              <div className="dashboard">
                  <Sidebar/>
                  <div className="productReviewContainer">
                  <form 
                className="productReviewForm"
                encType='multipart/form-data'
                onSubmit={productReviewSubmitHandler}
              >
                <h1>ALL REVIEWS</h1>
  
                <div>
                  <Star/>
                  <input 
                    type="text" 
                    placeholder='Product Id'
                    required
                    value={productId}
                    onChange={(e)=>setProductId(e.target.value)}
                    />
                </div>
                <Button
                  id='createProductBtn'
                  type='submit'
                  disabled={loading ? true : false||productId===""?true:false}
                >
                  Search
                </Button>
  
              </form>
  
                     {reviews  && reviews.length > 0 ? (
                      <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      disableSelectionOnClick
                      className='productListTable'
                      autoHeight
                  />):(
                    <h1 className='productReviewsFormHeading'>
                    No Reviews Found    
                    </h1>
                    )}
                  </div>
              </div>
          </Fragment>
    );
}

export default ProductReviews
