import React, { Fragment, useState } from 'react'
import './Header.css'
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PersonIcon from '@material-ui/icons/Person'
import { ShoppingCart } from '@material-ui/icons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ListAltIcon from '@material-ui/icons/ListAlt'
import DashboardIcon from '@material-ui/icons/Dashboard'
import {useNavigate} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {useAlert} from 'react-alert'
import { logout } from '../../../Actions/UserAction';

const UserOPtions = ({user}) => {
// console.log(user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const [open, setOpen] = useState(false);
    const {cartItems} = useSelector((state)=>state.cart)


    const options = [
      {icon:<ListAltIcon/>, name: "Orders", func:orders},
      {icon:<PersonIcon/>, name: "Profile", func:account},
      {icon:(
        <ShoppingCart
          style={{color: cartItems.length > 0 ? "tomato" : "unset"}}
        />), name: `Cart(${cartItems.length})`,  func:cart},
      {icon:<ExitToAppIcon/>, name: "Logout", func:logoutUser},
    ];

    if(user.role==="admin"){
      options.unshift({icon:<DashboardIcon/>,name:"Dashboard",func:dashboard});
    }

    function dashboard(){
      navigate("/dashboard");
    }

    function orders(){
      navigate("/myorder");
    }
   
    function account(){
      navigate("/account");
    }
  
    function cart(){
      navigate("/cart");
    }

    function logoutUser(){
      dispatch(logout());
      alert.success('Logout Successfully');
    }

  return (
    <Fragment>
         <Backdrop open={open} sx={{zIndex:"11" }} /> 
         <SpeedDial
            ariaLabel='SpeedDial tooltip example'
            onClose={()=> setOpen(false)}
            onOpen={()=> setOpen(true)}
            style={{zIndex:"11"}}
            direction='down'
            sx={{position:'absolute', top:2,right:14}}
            icon={<img
              className="speedDialIcon"
              src={user.avatar.url ? user.avatar.url : <SpeedDialIcon/>}
              alt="Profile"
            />}
         >
            {options.map((item)=>(
              <SpeedDialAction 
                  key={item.name} 
                  icon={item.icon} 
                  tooltipTitle={item.name} 
                  onClick={item.func}
                  tooltipOpen={window.innerWidth<=600?true:false}  
                  />   
            ))}
         </SpeedDial>
    </Fragment>
  )
}

export default UserOPtions
