import React, { useContext } from 'react'
import { Context } from '../main';
import Navbar from '../Components/Navbar';
import '../style/studentDashboard.css';

const StudentDashboard = () => {
  const {user} = useContext(Context);
  return (
    <div className='dashboard-container'>
      <Navbar user = {user}/>
    </div>
  )
}

export default StudentDashboard
