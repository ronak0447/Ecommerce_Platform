import React, { Fragment, useEffect } from 'react'
import Metadata from '../layout/Metadata'
import { Link,useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../layout/Loader/Loader'
import './Profile.css'

const Profile = () => {
    const navigate = useNavigate();
    const {user,loading,isAuthenticated} = useSelector((state)=>state.user)
    useEffect(()=>{
        if(isAuthenticated === false){
            navigate('/login')
        }
    },[isAuthenticated,navigate])
  return (
   <Fragment>
    {loading? <Loader/> : (
         <Fragment>
         <Metadata title={`${user.name}'s Profile`}/>
         <div className="profileContainer">
             <div>
                 <h1>My Profile</h1>
                 <img src={user.avatar.url} alt={user.name}/>
                 <Link to="me/update">Edit Profile</Link>
             </div>
             <div>
                 <div>
                     <h4>Full Name</h4>
                     <p>{user.name}</p>
                 </div>
                 <div>
                     <h4>Email</h4>
                     <p>{user.email}</p>
                 </div>
                 <div>
                     <h4>Joined On</h4>
                     <p>{String(user.createdAt).substring(0,10)}</p>
                 </div>
                 <div>
                     <Link to="/myorder">My Orders</Link>
                     <Link to="/api/changepassword">Change Password</Link>
                 </div>
             </div>
         </div>
     </Fragment>
    )}
   </Fragment>
  );
};

export default Profile
