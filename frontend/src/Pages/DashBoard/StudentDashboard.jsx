import React, { useContext } from 'react'
import { Context } from '../../main';
import Navbar from '../../Components/Navbar';
import '../../style/studentDashboard.css';
import { NavLink, Outlet } from 'react-router-dom';

const StudentDashboard = () => {
  const {user} = useContext(Context);
  return (
    <div className='dashboard-container'>
      <Navbar user = {user}/>
      <div className='dashboard-content'>
        <div className="sidebar">
          <NavLink to="dashboard" className="sidebar-options">Dashboard</NavLink>
          <NavLink to="update-profile" className="sidebar-options">Update Profile</NavLink>
          <NavLink to="jobs" className="sidebar-options">Explore Jobs</NavLink>
          <NavLink to="alumni" className="sidebar-options">Connect with Alumnis</NavLink>
          <NavLink to="notification" className="sidebar-options">Check Notifications</NavLink>
          <NavLink to ="chat" className="sidebar-options">Chat</NavLink>
        </div>
        <div className="display-area">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
