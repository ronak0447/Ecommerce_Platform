import React from 'react'
import profilePng from '../../Images/Profile.png';
import { useSelector } from 'react-redux';
import { Rating } from '@mui/material';

const ReviewCard = ({review}) => {
 
    const options = {
        size: "small",
        value: review.rating,
        readOnly:true,
        precision:0.5,
      }
const {user} = useSelector((state)=>state.user)
    return (
    <div className="reviewCard">
      <img src={profilePng? user.avatar.url : profilePng} style={{borderRadius:"50%",width:"5vmax",height:"5vmax"}} alt="User" />
      <p style={{fontSize:"0.9rem"}}>{review.name}</p>
      <Rating {...options}/>
      <span>{review.comment}</span>
    </div>
  )
}

export default ReviewCard;
