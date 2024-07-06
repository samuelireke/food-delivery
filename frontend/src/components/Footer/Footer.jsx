import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem qui modi sapiente pariatur commodi similique,
            debitis, repellat, dolorum obcaecati a alias ut soluta corporis eius
            consectetur eos quaerat porro vero!
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="facebook_icon" />
            <img src={assets.twitter_icon} alt="twitter_icon" />
            <img src={assets.linkedin_icon} alt="linkedin_icon" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+44 (0) 7706 797089 </li>
            <li>contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright &copy; {new Date().getFullYear()} Tomato.com - All Rights
        Reserved.
      </p>
    </div>
  );
};

export default Footer;
