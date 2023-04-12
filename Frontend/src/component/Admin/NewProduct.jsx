import React,{Fragment,useEffect,useState} from 'react';
import './NewProduct.css';
import { useSelector,useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import { AccountTree,Description,Storage,AttachMoney,Spellcheck } from '@material-ui/icons';
import Sidebar from './Sidebar';
import { NEW_PRODUCT_RESET } from '../../Constants/Productconstants';
import { useNavigate } from 'react-router-dom';
import {clearErrors,createProduct} from '../../Actions/ProductAction';

const NewProduct = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const {loading,error,success} = useSelector((state)=>state.newProduct);

  const [name , setName] = useState();
  const [price , setPrice] = useState();
  const [description , setDescription] = useState();
  const [Stock, setStock] = useState();
  const [category, setCategory] = useState();
  const [images, setImages] = useState([]);
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
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    if(success){
      alert.success("Product Created Successfully");
      navigate("/admin/dashboard");
      dispatch({type:NEW_PRODUCT_RESET});
    }

  },[dispatch,error,alert,navigate,success])

  const createFormSubmitHandler = (e)=>{
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

    dispatch(createProduct(myForm));
  };
  const createProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

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
        <Metadata title="Create Product"/>
        <div className="dashboard">
          <Sidebar/>
          <div className="newProductContainer">
            <form 
              className="createProductForm"
              encType='multipart/form-data'
              onSubmit={createFormSubmitHandler}
            >
              <h1>Create Product</h1>

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
                <select onChange={(e)=>setCategory(e.target.value)}>
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
                  />
              </div>

              <div id="createProductFormFile">
                <input 
                  type="file"
                  name='avatar'
                  accept='image/*'
                  onChange={createProductImageChange}
                  multiple
                  />
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
                Create
              </Button>

            </form>
          </div>
        </div>
    </Fragment>
  )
}

export default NewProduct
