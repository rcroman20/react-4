import React from 'react';
import { FaHome, FaInfoCircle, FaConciergeBell, FaEnvelope } from 'react-icons/fa'; // Importa los íconos de FontAwesome
import './VerticalNavbar.css';

const VerticalNavbar = () => {
  return (
    <div className="navbar">
      <ul>
        <li>
          <a href="#home">
            <FaHome /> Home
          </a>
        </li>
        <li>
          <a href="#about">
            <FaInfoCircle /> About
          </a>
        </li>
        <li>
          <a href="#services">
            <FaConciergeBell /> Services
          </a>
        </li>
        <li>
          <a href="#contact">
            <FaEnvelope /> Contact
          </a>
        </li>
      </ul>
    </div>
  );
};

export default VerticalNavbar;
