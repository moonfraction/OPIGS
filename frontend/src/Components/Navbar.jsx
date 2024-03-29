import React, { useContext } from "react";
import "../style/navbar.css";
import { Context } from "../main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = ({ user }) => {
  const { typeUser ,setAuthorised} = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async (e) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/${typeUser}/logout`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });
      setAuthorised(false);
      navigateTo("/login");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="navbar-container">
      <div className="opigs-text">
        <h1>OPIGS</h1>
      </div>
      <div className="nav-right">
        <div className="user-photo">
          <img src={
            typeUser === "student" ? user.profilePhoto : (
              typeUser === "alumni" ? user.avatar : (
                typeUser === "company" ? user.logo : ""
              )
            )
          } alt="user" />
        </div>
        <button className="logout-button" onClick={(e) => handleLogout(e)}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
