import React,{Fragment, useEffect, useState} from 'react'
import './ForgotPassword.css'
import Loader from '../layout/Loader/Loader';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors,forgotPassword } from '../../Actions/UserAction';
import { useAlert } from 'react-alert'
import Metadata from '../layout/Metadata';

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
 
    const { error, message, loading } = useSelector((state) => state.forgotPassword);
    const [email, setEmail] = useState("");

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        };
        if (message) {
            alert.success(message);
        }

    },[dispatch,alert,error,message])

    const forgotPasswordSubmit = (e) =>{
        e.preventDefault();

        const myform = new FormData();

        myform.set("email",email);
        dispatch(forgotPassword(myform));
    }

  return (
    <Fragment>
    {loading ? <Loader/> : (
        <Fragment>
            <Metadata title="Forgot Password"/>
        <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
               <h2 className="forgotPasswordHeading">Forgot Password</h2>
                <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>
                    <div className="forgotPasswordEmail">
                        <MailOutlineIcon />
                        <input
                            type="email"
                            placeholder='Email'
                            required
                            name='email'
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)} />
                    </div>
                    <input
                        type="submit"
                        value="Send"
                        className="forgotPasswordBtn"
                    // disabled={loading ? true : false} 
                    />
                </form>
            </div>
        </div>
    </Fragment>
    )}
</Fragment>
  )
}

export default ForgotPassword
