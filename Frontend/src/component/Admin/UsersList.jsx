import React,{Fragment,useEffect} from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './userList.css';
import {useSelector,useDispatch} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import {Edit,Delete} from '@material-ui/icons';
import Sidebar from './Sidebar';
import { getAllUsers,clearErrors, deleteUser } from '../../Actions/UserAction';
import { DELETE_USER_RESET } from '../../Constants/UserConstants';

const UsersList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();  

  const {error,users} = useSelector((state)=>state.allUsers);
  const {error:deleteError,isDeleted,message} = useSelector((state)=>state.profile);

  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
    if(deleteError){
        alert.error(error);
        dispatch(clearErrors());
    }
    if(isDeleted){
        alert.success(message);
        navigate("/admin/users");
        dispatch({type:DELETE_USER_RESET});
    }
    dispatch(getAllUsers());
  },[dispatch,error,alert,isDeleted,deleteError,navigate,message]) ; 

  const deleteUserHandler =(id)=>{
    dispatch(deleteUser(id));
  }

  const columns =[
    {field:"id",headerName:"User ID",minwidth:180,flex:0.8},
    {
        field:"email",
        headerName:"Email",
        minwidth:200,
        flex:1,
    },
    {
        field:"name",
        headerName:"name",
        minwidth:150,
        flex:0.5,
    },
    {
        field:"role",
        headerName:"Role",
        minwidth:150,
        type:"number",
        flex:0.3,
        cellClassName: (params) => {
          return params.getValue(params.id,"role") === "admin"
          ? "greenColor"
          : "redColor";
      }
    },
    {
        field:"actions",
        headerName:"Actions",
        minwidth:150,
        type:"number",
        flex:0.3,
        sortable:false,
        renderCell:(params) =>{
            return(
                <Fragment>
                    <Link to={`/admin/user/${params.getValue(params.id,"id")}`}>
                        <Edit/>
                    </Link>

                    <Button onClick={()=>deleteUserHandler(params.getValue(params.id,"id"))}>
                        <Delete/>
                    </Button>
                </Fragment>
            )
        },
    },

  ];
  const rows =[];

  users && 
    users.forEach((item)=>{
        rows.push({
            id:item._id,
            role:item.role,
            email:item.email,
            name:item.name,
        });
    });

  return (
        <Fragment>
            <Metadata title={`ALL USERS - Admin`}/>
            <div className="dashboard">
                <Sidebar/>
                <div className="userListContainer">
                    <h1 className="userListHeading">ALL USERS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='userListTable'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
  );
}

export default UsersList
