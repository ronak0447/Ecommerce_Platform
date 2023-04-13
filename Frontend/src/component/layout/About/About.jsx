import React from 'react';
import './About.css';
import { Button,Typography,Avatar } from '@mui/material';
import { Facebook,Instagram,GitHub } from '@material-ui/icons';


const About = () => {

  const visitInsta = ()=> {
    window.location = "https://www.instagram.com/__rony017__";
  };  

  return (
    <div className='aboutSection'>
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>
        <div>
          <div>
            <Avatar
                style={{width:"10vmax", height:"10vmax",margin:"2vmax 0"}}
                src='/home/pc/Ecommerce/Ecommerce_Platform/Frontend/src/Images/logo.png'
                alt='Founder'
            />
            <Typography>Ronak Patel</Typography>
            <Button onClick={visitInsta}>
                Visit Insta...
            </Button>
            <span>
                This is a Basic Ecommerce website made by @RonakPatel. With the 
                purpose to starting a career in IT...
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Visit On This</Typography>
            <a href="https://www.facebook.com/" target='blank'>
                <Facebook className='facebookIcon'/>
            </a>
            <a href="https://www.instagram.com/" target='blank'>
                <Instagram className='instagramIcon'/>
            </a>
            <a href="https://www.github.com/" target='blank'>
                <GitHub className='githubIcon'/>
            </a>
          </div>
        </div>    
      </div>
    </div>
  )
}

export default About
