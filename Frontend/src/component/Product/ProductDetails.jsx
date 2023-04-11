import React, { Fragment, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import "./ProductDetails.css";
import {useSelector,useDispatch} from 'react-redux';
import {clearErrors, getProductDetails, newReview} from "../../Actions/ProductAction";
import { useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard';
import Loader from '../layout/Loader/Loader';
import {useAlert} from 'react-alert';
import MetaData from '../layout/Metadata';
import {addItemsToCart} from '../../Actions/CartActions';
import { Dialog,DialogActions,DialogContent,DialogTitle,Button, Rating } from '@mui/material';
import { NEW_REVIEW_RESET } from '../../Constants/Productconstants';


const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const alert = useAlert();
  const {product,loading,error} = useSelector((state)=>state.productDetails);
  const {success,error:reviewError} = useSelector((state)=>state.newReview);

  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    if(reviewError){
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if(success){
      alert.success("Review Submit Succefully");
      dispatch({type:NEW_REVIEW_RESET});
    }
   dispatch(getProductDetails(id)) 
  },[dispatch,id,alert,error,success,reviewError]);

  const options ={
    size: "large",
    value: product.ratings,
    precision:0.5,
    readOnly:true,
  }
  const [quantity,setQuantity] = useState(1);
  const increaseQuantity = () =>{
    if(product.Stock <= quantity)return;
    const qty = quantity + 1;
    setQuantity(qty);
  };
  const decreaseQuantity = () =>{
    if(1 >= quantity)return;
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () =>{
    dispatch(addItemsToCart(id,quantity));
    alert.success("Item Added To Cart");
  }
  const [open,setOpen] = useState(false);
  const [comment,setComment] = useState("");
  const [rating,setRating]= useState(0);

  const submitReviewToggle = ()=>{
    open ? setOpen(false) : setOpen(true);
  }
  const reviewSubmitHandler = ()=>{
    const myForm = new FormData();

    myForm.set("rating",rating);
    myForm.set("comment",comment);
    myForm.set("productId",id)

    dispatch(newReview(myForm));
    setOpen(false);
  }
  return (
     <Fragment>
      {loading ? <Loader/> :(
         <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`}/>
         <div className="ProductDetails">
           <div>
             <Carousel>
               {product.images &&
                 product.images.map((item,i)=>(
                   <img 
                     className="CarouselImage"  
                     key={item.url}
                     src={item.url} 
                     alt={`${i} Slide`}
                   />
                   ))}
             </Carousel>
           </div>

           <div>
               <div className="detailsblock-1">
                 <h2>{product.name}</h2>
                 <p>product Id {product._id}</p>
               </div>
               <div className="detailsBlock-2">
                 <Rating {...options}/>
                 <span>({product.numOfReviews} Reviews)</span>
               </div>
               <div className="detailsBlock-3">
                 <h1>{`₹${product.price}`}</h1>
                 <div className="detailsBlock-3-1">
                   <div className="detailsBlock-3-1-1">
                     <button onClick={decreaseQuantity}>-</button>
                     <input readOnly value={quantity} type="number" />
                     <button onClick={increaseQuantity}>+</button>
                   </div>
                   <button
                   disabled={product.Stock < 1 ? true:false} 
                   onClick={addToCartHandler}>Add to Cart</button>
                 </div>

                 <p>
                   Status:
                   <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                     {product.Stock < 1 ? "OutofStock" : "InStock"}
                   </b>
                 </p>
               </div>

               <div className="detailsBlock-4">
                 Description: <p>{product.description}</p>
               </div>

               <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
           </div>
         </div>

         <h3 className="reviewsHeading">Reviews</h3>
         <Dialog
            aria-labelledby='simple-dialog-title'
            open={open}
            onClose={submitReviewToggle}
         >
          <DialogTitle>Submit Review</DialogTitle>
          <DialogContent className='submitDialog'>
            <Rating
              onChange={(e)=>setRating(e.target.value)}
              value={rating}
              size='large'
            />
            <textarea
              className='submitDialogTextArea'
              cols="30"
              rows="5"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
            ></textarea>
          </DialogContent>
          <DialogActions>
            <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
            <Button onClick={reviewSubmitHandler} color='primary' >Submit</Button>
          </DialogActions>
          </Dialog>           


         {product.reviews && product.reviews[0] ? (
           <div className="reviews">
           {product.reviews &&
            product.reviews.map((review) => <ReviewCard key={review._id} review={review}/>)}
           </div>
         ):(
           <p className="noReviews">No Reviews Yet</p>
         )}
     </Fragment>
      )}
     </Fragment>
  )
}

export default ProductDetails
