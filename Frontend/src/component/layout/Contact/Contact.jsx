import React from 'react';
import { Button } from '@mui/material';
import './Contact.css'

const Contact = () => {
    return (
        <div className="contactContainer">
          <a className="mailBtn" href="mailto:ronak0447@gmail.com">
            <Button>Contact: ronak0447@gmail.com</Button>
          </a>
        </div>
      );
}

export default Contact
