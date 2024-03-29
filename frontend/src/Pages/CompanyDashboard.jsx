import React, { useContext } from 'react'
import Navbar from '../Components/Navbar';
import { Context } from '../main';

const CompanyDashboard = () => {
  const {user} = useContext(Context);
  return (
    <div className='dashboard-container'>
      <Navbar user = {user}/>
    </div>
  )
}

export default CompanyDashboard
