import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Context } from "../../main.jsx";
import "../../style/common.css";
import "../../style/job.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { authorised } = useContext(Context);
  const navigateTo = useNavigate();
  const [company,setCompany] = useState({});
  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/alljobs", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
    
  }, []);

  if (!authorised) {
    navigateTo("/");
  }

  return (
    <section className="jobs">
      <div className="container">
        <div className="banner">
          {jobs.jobs &&
            jobs.jobs.map((element) => {
              return (
                <div className="card" key={element._id}>
                  <p>{element.title}</p>
                  <p>{element.companyName}</p>
                  <p>{element.category}</p>
                  <p>{element.location}</p>
                  <NavLink to={`/api/v1/student/jobDetails/${element._id}`}>Job Details</NavLink>
                </div>
              );
            })}
        </div>
       
      </div>
      <Outlet/>
    </section>
  );
};

export default Jobs;