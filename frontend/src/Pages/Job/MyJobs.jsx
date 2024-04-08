import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import '../../style/viewCompanyJob.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobCard = ({job})=>{
  const navigateTo = useNavigate();
  return (
    <div className="job-card">
      <div className="detail">
        <p>{job.title}</p>
      </div>
      <div className="view">
        <button onClick={()=> navigateTo(`/api/v1/company/update-job/${job._id}`)}>View & Edit</button>
      </div>
    </div>
  )
}

const MyJobs=()=>{
  const [jobs,setJobs]=useState([]);
  useEffect(()=>{
    const fetchJobs=async()=>{
      const response = await axios.get("http://localhost:4000/api/v1/job/getjobs", {
        withCredentials: true,
        headers:{
          "Content-Type":"application/json"
        }
      })
      setJobs(response.data.jobs);
    }
    fetchJobs();
  })
  return(
    <div className="posted-jobs-container">
      {jobs.map((job) => {
        return <JobCard job={job} />;
      })}
    </div>
  )
}
export default MyJobs;