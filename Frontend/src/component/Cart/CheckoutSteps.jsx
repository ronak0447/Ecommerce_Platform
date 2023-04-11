import React, { Fragment } from 'react';
import { AccountBalance, LibraryAddCheck, LocalShipping } from '@material-ui/icons';
import { Step, StepLabel, Stepper, Typography } from '@mui/material';
import './CheckoutSteps.css'

const CheckoutSteps = ({activeStep}) => {
  
    const steps =[
        {
            label: <Typography>Shipping Details</Typography>,
            icon:<LocalShipping/>,
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon:<LibraryAddCheck/>,
        },
        {
            label:<Typography>Payment</Typography>,
            icon:<AccountBalance/>,
        },
    ]
    const stepStyles ={
        boxSizing:"border-box",
    };

    return (
        <Fragment>
          <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
            {steps.map((item,index)=>(
                <Step key={index} 
                      active={activeStep === index ? false : true}
                      completed={activeStep >= index ? true : false} >
                    
                    <StepLabel icon={item.icon}
                        style={{color: activeStep >= index ? "tomato" : "rgba(0,0,0,0.649)",}}
                    >{item.label}</StepLabel>
                </Step>
            ))}
          </Stepper>  
        </Fragment>
  )
}

export default CheckoutSteps
