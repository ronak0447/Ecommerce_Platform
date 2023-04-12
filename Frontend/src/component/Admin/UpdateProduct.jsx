import React,{Fragment,useEffect,useState} from 'react';
import './UpdateProduct.css';
import { useSelector,useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import { AccountTree,Description,Storage,AttachMoney,Spellcheck } from '@material-ui/icons';
import Sidebar from './Sidebar';
import { UPDATE_PRODUCT_RESET } from '../../Constants/Productconstants';
import { useNavigate, useParams } from 'react-router-dom';
import {clearErrors,updateProduct,getProductDetails} from '../../Actions/ProductAction';

const UpdateProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {id} = useParams();
  
    const {error,product} = useSelector((state)=>state.productDetails);
    const {loading,error:updateError,isUpdated} = useSelector((state)=>state.product);
  
    const [name , setName] = useState();
    const [price , setPrice] = useState();
    const [description , setDescription] = useState();
    const [Stock, setStock] = useState();
    const [category, setCategory] = useState();
    const [images, setImages] = useState([]);
    const [oldimages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
  
    const categories = [
      "Laptop",
      "Footwear",
      "Bottom",
      "tops",
      "Attire",
      "Camera",
      "smartPhones"
  ];
  
    useEffect(()=>{
      if(product && product._id !== id){
        dispatch(getProductDetails(id));
      }else{
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setStock(product.Stock);
        setOldImages(product.images);
      }  

      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }
      if(updateError){
        alert.error(updateError);
        dispatch(clearErrors());
      }
      if(isUpdated){
        alert.success("Product Updated Successfully");
        navigate("/admin/products");
        dispatch({type:UPDATE_PRODUCT_RESET});
      }
  
    },[dispatch,updateError,error,alert,navigate,isUpdated,product,id])
  
    const updateFormSubmitHandler = (e)=>{
      e.preventDefault();
  
      let myForm = new FormData();
  
      myForm.set("name",name);
      myForm.set("price",price);
      myForm.set("description",description);
      myForm.set("category",category);
      myForm.set("Stock",Stock);
  
      images.forEach((image)=>{
        myForm.append("images",image);
      });
  
      dispatch(updateProduct(id,myForm));
    };
    const updateProductImageChange = (e) => {
      const files = Array.from(e.target.files);
      setImages([]);
      setImagesPreview([]);
      setOldImages([]);
  
      files.forEach((file)=>{
          const reader = new FileReader();
  
          reader.onload = () =>{
            if(reader.readyState === 2){
              setImagesPreview((old)=>[...old,reader.result]);
              setImages((old)=>[...old,reader.result]);
            }
          };
  
          reader.readAsDataURL(file);
      });
    };
  
  
    return (
      <Fragment>
          <Metadata title="Update Product"/>
          <div className="dashboard">
            <Sidebar/>
            <div className="newProductContainer">
              <form 
                className="createProductForm"
                encType='multipart/form-data'
                onSubmit={updateFormSubmitHandler}
              >
                <h1>Update Product</h1>
  
                <div>
                  <Spellcheck/>
                  <input 
                    type="text" 
                    placeholder='Product Name'
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div>
                  <AttachMoney/>
                  <input 
                    type="number"
                    placeholder='Price'
                    required
                    onChange={(e)=>setPrice(e.target.value)}
                    value={price}
                    />
                </div>
                <div>
                  <Description/>
                  <textarea
                    placeholder='Product Description'
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    cols="30"
                    rows="1"
                  ></textarea>
                </div>
  
                <div>
                  <AccountTree/>
                  <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                      <option value="">Choose Category</option>
                      {categories.map((cate)=>(
                        <option key={cate} value={cate}>
                          {cate}
                        </option>
                      ))}
                  </select>
                </div>
  
                <div>
                  <Storage/>
                  <input 
                    type="number" 
                    placeholder='Stock'
                    required
                    onChange={(e)=>setStock(e.target.value)}
                    value={Stock}
                    />
                </div>
  
                <div id="createProductFormFile">
                  <input 
                    type="file"
                    name='avatar'
                    accept='image/*'
                    onChange={updateProductImageChange}
                    multiple
                    />
                </div>
                <div id="createProductFormImage">
                  {oldimages 
                  && oldimages.map((image,index)=>(
                    <img key={index} src={image.url} alt='Old Product Preview'/>
                  ))}
                </div>        
  
                <div id="createProductFormImage">
                  {imagesPreview.map((image,index)=>(
                    <img key={index} src={image} alt='Product Preview'/>
                  ))}
                </div>        
  
                <Button
                  id='createProductBtn'
                  type='submit'
                  disabled={loading ? true : false}
                >
                  Update
                </Button>
  
              </form>
            </div>
          </div>
      </Fragment>
    )
}

export default UpdateProduct
