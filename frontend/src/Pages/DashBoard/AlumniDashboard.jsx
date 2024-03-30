import React, { useContext } from "react";
import Navbar from "../../Components/Navbar";
import { Context } from "../../App";
import { NavLink, Outlet } from "react-router-dom";
import "../../style/alumniDashboard.css";

const AlumniDashboard = () => {
  const { user } = useContext(Context);
  return (
    <div className="dashboard-container">
      <Navbar user={user} />
      <div className="dashboard-content">
        <div className="sidebar">
          <NavLink to="dashboard" className="sidebar-options">
            Dashboard
          </NavLink>

          <NavLink to="update-profile" className="sidebar-options">
            Update Profile
          </NavLink>

          <NavLink to="view-request" className="sidebar-options">
            View Request
          </NavLink>

          <NavLink to="dashboard" className="sidebar-options">
            Chat
          </NavLink>
        </div>
        <div className="display-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
