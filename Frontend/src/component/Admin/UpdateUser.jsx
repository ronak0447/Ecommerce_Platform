import React,{Fragment,useEffect,useState} from 'react';
import './NewProduct.css';
import { useSelector,useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import { MailOutline,Person,VerifiedUser } from '@material-ui/icons';
import Sidebar from './Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_USER_RESET } from '../../Constants/UserConstants';
import { getUserDetails, updateUser ,clearErrors} from '../../Actions/UserAction';
import Loader from '../layout/Loader/Loader';

const UpdateUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
  
    const {loading,error,user} = useSelector((state)=>state.userDetails);
    const {loading:upDateLoading,error:updateError,isUpdated} = useSelector((state)=>state.profile);
  
    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [role , setRole] = useState("");
    const {id} = useParams();

  
    useEffect(()=>{
      if(user && user._id !== id){
        dispatch(getUserDetails(id));
      }else{
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
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
        alert.success("User Updated Successfully");
        navigate("/admin/users");
        dispatch({type:UPDATE_USER_RESET});
      }
  
    },[dispatch,error,alert,navigate,isUpdated,updateError,id,user])
  
    const updateUserSubmitHandler = (e)=>{
      e.preventDefault();
  
      let myForm = new FormData();
  
      myForm.set("name",name);
      myForm.set("email",email);
      myForm.set("role",role);
 
      dispatch(updateUser(id,myForm));
    };
    return (
      <Fragment>
          <Metadata title="UPDATE USER"/>
          <div className="dashboard">
            <Sidebar/>
            <div className="newProductContainer">
            {loading ? (
            <Loader/>
            ):(
                <form 
                className="createProductForm"
                encType='multipart/form-data'
                onSubmit={updateUserSubmitHandler}
              >
                <h1>UPDATE USER</h1>
  
                <div>
                  <Person/>
                  <input 
                    type="text" 
                    placeholder='Name'
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div>
                  <MailOutline/>
                  <input 
                    type="email"
                    placeholder='Email'
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>
                <div>
                  <VerifiedUser/>
                  <select value={role} onChange={(e)=>setRole(e.target.value)}>
                      <option value="">Choose Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                  </select>
                </div>
  
                <Button
                  id='createProductBtn'
                  type='submit'
                  disabled={upDateLoading ? true : false||role===""?true:false}
                >
                  Update
                </Button>
  
              </form>
            )}
            </div>
          </div>
      </Fragment>
    );
};

export default UpdateUser
