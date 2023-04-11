import React, { Fragment, useState, useEffect } from 'react';
import './ResetPassword.css';
import Loader from '../layout/Loader/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, resetPassword } from '../../Actions/UserAction';
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom';
import Metadata from '../layout/Metadata';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useParams } from 'react-router-dom';

const ResetPassword = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const {token} = useParams();
    const { error, success, loading } = useSelector((state) => state.forgotPassword);

    const [newpassword , setNewPassword] = useState("");
    const [confirmpassword , setConfirmPassword] = useState("");





    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("newpassword", newpassword);
        myForm.set("confirmpassword", confirmpassword);
        dispatch(resetPassword(token,myForm));
    }

    

    useEffect(() => {
       
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Password Updated Successfully");
            navigate("/login");
        }
    }, [dispatch, error, alert, navigate, success]);

  return (
    <Fragment>
    {loading ? <Loader/> : (
        <Fragment>
            <Metadata title="Reset Password"/>
        <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
               <h2 className="resetPasswordHeading">Reset Password</h2>
                <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
                     <div className="resetPassword">
                      <LockOpenIcon/>
                      <input 
                        type="password"
                        placeholder='New Password' 
                        required
                        value={newpassword}
                        onChange={(e)=>setNewPassword(e.target.value)}/>
                    </div>
                     <div className="resetPassword">
                      <LockIcon/>
                      <input 
                        type="password"
                        placeholder='Confirm Password' 
                        required
                        value={confirmpassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    </div>
                   
                    <input
                        type="submit"
                        value="Reset"
                        className="resetPasswordBtn"
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

export default ResetPassword
