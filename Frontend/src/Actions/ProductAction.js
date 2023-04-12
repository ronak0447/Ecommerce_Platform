import axios from 'axios';
import { 
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL, 
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL
} from "../Constants/Productconstants";
//Get All Products 
export const getProduct = 
(keyword="",currentPage=1,price=[0,25000],category,ratings=0) =>
async(dispatch)=>{
  try {
    dispatch({type:ALL_PRODUCT_REQUEST});

    let link =`/api/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings=${ratings}`;
    
    if(category){
      link = `/api/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings=${ratings}`;
    }
   
    const{data}= await axios.get(link);

    dispatch({
        type:ALL_PRODUCT_SUCCESS,
        payload:data,
    });
  } catch (error) {
    dispatch({
       type: ALL_PRODUCT_FAIL,
       payload: error.response.data.message
    });
  }
}; 

//Get All Products (Admin)
export const getAdminProduct = ()=>async(dispatch)=>{
  try {
    dispatch({type:ADMIN_PRODUCT_REQUEST});

    const {data} = await axios.get("/api/admin/products");

    dispatch({
      type:ADMIN_PRODUCT_SUCCESS,
      payload:data.products,
    })

  } catch (error) {
    dispatch({
      type:ADMIN_PRODUCT_FAIL,
      payload:error.response.data.message,
    })
  }
};

//Create Product (Admin)
export const createProduct = (productData) =>async(dispatch)=>{
  try {
    dispatch({type:NEW_PRODUCT_REQUEST});

    const config = {
      headers:{ "Content-Type":"application/json"}   
    }

    const{data}= await axios.put(`/api/admin/addproduct`,productData,config);

    dispatch({
        type:NEW_PRODUCT_SUCCESS,
        payload:data,
    });
  } catch (error) {
    dispatch({
       type: NEW_PRODUCT_FAIL,
       payload: error.response.data.message
    });
  }
};


//Get Product Details
export const getProductDetails = (id) =>async(dispatch)=>{
  try {
    dispatch({type:PRODUCT_DETAILS_REQUEST});

    const{data}= await axios.get(`/api/details/${id}`);

    dispatch({
        type:PRODUCT_DETAILS_SUCCESS,
        payload:data.product,
    });
  } catch (error) {
    dispatch({
       type: PRODUCT_DETAILS_FAIL,
       payload: error.response.data.message
    });
  }
}; 

//New Review
export const newReview = (reviewData) =>async(dispatch)=>{
  try {
    dispatch({type:NEW_REVIEW_REQUEST});

    const config = {
      headers:{ "Content-Type":"application/json"}   
    }

    const{data}= await axios.put(`/api/review`,reviewData,config);

    dispatch({
        type:NEW_REVIEW_SUCCESS,
        payload:data.success,
    });
  } catch (error) {
    dispatch({
       type: NEW_REVIEW_FAIL,
       payload: error.response.data.message
    });
  }
}; 
// Clearing Errors
export const clearErrors =()=>async(dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS,
    });
};