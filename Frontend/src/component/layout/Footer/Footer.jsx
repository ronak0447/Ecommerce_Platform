import React from 'react'
import playstore from "../../../Images/playstore.png"
import appstore from "../../../Images/Appstore.png"
import './footer.css'

function Footer() {
  return (
    <footer id="footer">
        <div className="leftFooter">
         <h4>GET APP</h4>
         <p>Download App for Android and IOS mobile Phone</p>   
         <img src={playstore} alt="playstore"/>   
         <img src={appstore} alt="appstore"/>   
        </div>
        <div className="midFooter">
          <h1>Ecommerce</h1>
          <p>High Quality is our first priority</p>

          <p>Copyrights 2023 &copy; RonakPatel</p>
        </div>
        <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="/">Facebook</a>
        <a href="/">Instagram</a>
        <a href="/">GitHub</a>
        </div>
    </footer>
  );
}

export default Footer
