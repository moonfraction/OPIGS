import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import "../../style/common.css";
import "../../style/job.css";
const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorised, user } = useContext(Context);

  useEffect(() => {
    const fetchJobDetail = async () =>{
      try {
        axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
      } catch (error) {
        console.log(error);
      }
    }
    fetchJobDetail();
  }, []);

  return (
    <section className="jobDetail">
      <div className="container">
        <div className="banner">
          <p>
            Title: <span> {job.title}</span>
          </p>
          <p>
            Category: <span>{job.category}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Company: <span>{job.company}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Deadline: <span>{job.deadline}</span>
          </p>
          <p>
            Salary: <span>{job.salary}</span>
          </p>
          <Link to ={`/api/v1/student/postApplication/${job._id}`}>Apply Now</Link>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;