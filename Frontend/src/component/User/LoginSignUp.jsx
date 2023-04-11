import React, { Fragment,useRef,useState,useEffect } from 'react';
import './LoginSignUp.css';
import Loader from '../layout/Loader/Loader';
import {Link,useLocation} from 'react-router-dom';
import MailOutline from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import {useSelector,useDispatch} from 'react-redux';
import {clearErrors,login,register} from '../../Actions/UserAction';
import {useAlert} from 'react-alert'
import { useNavigate } from 'react-router-dom';

const LoginSignUp = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const {error,loading,isAuthenticated} = useSelector((state)=>state.user);
  
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);



  const [loginEmail , setLoginEmail] = useState("");
  const [loginPassword , setLoginPassword] = useState("");
  const [user , setUser] = useState({
    name:"",
    email:"",
    password:"",
  })

  const {name,email,password} = user;

  const [avatar , setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = (e) =>{
    e.preventDefault();
    dispatch(login(loginEmail,loginPassword));
    alert.success("Login Successfully");
  };

  const registerSubmit = (e) =>{
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name",name);
    myForm.set("email",email);
    myForm.set("password",password);
    myForm.set("avatar",avatar);
    dispatch(register(myForm));
    alert.success("Register Successfully");
  }

  const registerDataChange =(e) => {
    if(e.target.name === "avatar"){
       const reader = new FileReader();

       reader.onload=()=>{
        if(reader.readyState === 2){
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
       };

       reader.readAsDataURL(e.target.files[0]);
    }else{
      setUser({...user,[e.target.name]: e.target.value});
    }
  }

  const redirect =location.search ? location.search.split("=")[1]:"/account"

  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    if(isAuthenticated){
      navigate(redirect)
    }  
  },[dispatch,error,alert,navigate,isAuthenticated,redirect]);

  const switchTabs = (e,tab) =>{
    if(tab === "login"){
      switcherTab.current.classList.add("shitToNeutral");
      switcherTab.current.classList.remove("shitToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if(tab === "register"){
      switcherTab.current.classList.add("shitToRight");
      switcherTab.current.classList.remove("shitToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  }


  return (
    <Fragment>
      {loading ? <Loader/> : (
        <Fragment>
        <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                 <div className="login_signUp_toggle">
                    <p onClick={(e)=> switchTabs(e, "login")}>LOGIN</p>
                    <p onClick={(e)=> switchTabs(e, "register")}>REGISTER</p>
                 </div> 
                 <button ref={switcherTab}></button> 
              </div>  
              <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                    <MailOutline/>
                    <input 
                      type="email"
                      placeholder='Email'
                      required
                      value={loginEmail}
                      onChange={(e)=> setLoginEmail(e.target.value)}
                    />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon/>
                  <input 
                      type="password" 
                      placeholder='password'
                      required
                      value={loginPassword}
                      onChange={(e)=> setLoginPassword(e.target.value)}/>
                </div>
                <Link to="/api/forgot">Forgot Password?</Link>
                <input type="submit" value="login" className="loginBtn" />
              </form>
              <form 
                  className="signUpForm"
                  ref={registerTab}
                  encType="multipart/form-data"
                  onSubmit={registerSubmit}
                  >
                    <div className="signUpName">
                      <FaceIcon/>
                      <input 
                        type="text"
                        placeholder='Name'
                        required
                        name='name'
                        value={name}
                        onChange={registerDataChange} />
                    </div>
                    <div className="signUpEmail">
                      <MailOutline/>
                      <input 
                        type="email"
                        placeholder='Email' 
                        required
                        name='email'
                        value={email}
                        onChange={registerDataChange}/>
                    </div>
                    <div className="signUpPassword">
                      <LockOpenIcon/>
                      <input 
                        type="password"
                        placeholder='Password' 
                        required
                        name='password'
                        value={password}
                        onChange={registerDataChange}/>
                    </div>

                    <div id="registerImage">
                      <img src={avatarPreview} alt="Avatar Preview" />
                      <input 
                        type="file"
                        name='avatar'
                        accept='image/*'
                        onChange={registerDataChange}
                         />
                    </div>
                    <input 
                        type="submit"
                        value="Register"
                        className="signUpBtn"
                        // disabled={loading ? true : false} 
                        />
              </form>
            </div>
        </div>
    </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp
