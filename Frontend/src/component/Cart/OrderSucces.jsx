import React from 'react';
import './OrderSuccess.css';
import {Typography} from '@mui/material';
import { Link } from 'react-router-dom';
import { CheckCircle } from '@material-ui/icons';

const OrderSucces = () => {
  return (
    <div className='orderSuccess'>
      <CheckCircle/>

      <Typography>Your Order has been Placed Successfully</Typography>
      <Link to="/myorder">View Orders</Link>
    </div>
  );
};

export default OrderSucces;
