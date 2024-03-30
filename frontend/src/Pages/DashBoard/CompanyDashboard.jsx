import React, { useContext } from 'react'
import Navbar from '../../Components/Navbar';
import { Context } from '../../main';
import { NavLink ,Outlet} from 'react-router-dom';
import '../../style/companyDashboard.css';

const CompanyDashboard = () => {
  const {user} = useContext(Context);
  return (
    <div className='dashboard-container'>
      <Navbar user = {user}/>
      <div className='dashboard-content'>
        <div className="sidebar">
          <NavLink to="dashboard" className="sidebar-options">DashBoard</NavLink>
          <NavLink to="update-profile" className="sidebar-options">Update Profile</NavLink>
          <NavLink to="post-new-job" className="sidebar-options">Post Jobs</NavLink>
          <NavLink to="my-applications" className="sidebar-options">View Applications</NavLink>
          <NavLink to="notification" className="sidebar-options">Notifications</NavLink>
          <NavLink to="my-posted-jobs" className="sidebar-options">Posted Jobs</NavLink>
          <NavLink to="view-all-students" className="sidebar-options">View Students</NavLink>
        </div>
        <div className="display-area">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard
