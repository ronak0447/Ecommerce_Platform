import React from 'react'
import { Navigate,Outlet } from 'react-router-dom';
import {useSelector} from 'react-redux';

const ProtectedRoutes = ({children,isAdmin}) => {
  const {loading,user,isAuthenticated} = useSelector((state)=>state.user);
    if(loading === false) {
     if(isAuthenticated === false){
        return <Navigate to={"/login"}/>
    }
    if(isAdmin === true && user.role !== "admin"){
      return <Navigate to={"/login"}/>
    }
    }
  
  return children? children:<Outlet/>;
};

export default ProtectedRoutes
