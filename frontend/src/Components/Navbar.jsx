import React, { useContext } from "react";
import "../style/navbar.css";
import { Context } from "../main";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const { typeUser } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async (e) => {
    await axios.post(`http://localhost:4000/api/v1/${typeUser}/logout`);
    navigateTo("/login");
  };

  return (
    <div className="navbar-container">
      <div className="opigs-text">
        <h1>OPIGS</h1>
      </div>
      <div className="nav-right">
        <div className="user-photo">
          <img src={user.profilePhoto} alt="user" />
        </div>
        <button className="logout-button" onClick={(e) => handleLogout(e)}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
