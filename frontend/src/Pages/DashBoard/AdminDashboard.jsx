import React, { useContext } from "react";
import Navbar from "../../Components/Navbar";
import { Context } from "../../main";
import { NavLink, Outlet } from "react-router-dom";
import "../../style/adminDashboard.css";

const AdminDashboard = () => {
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

          <NavLink to="verify-company" className="sidebar-options">
            View Request
          </NavLink>

          <NavLink to="send-notification" className="sidebar-options">
           Send Notification
          </NavLink>
        </div>
        <div className="display-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
