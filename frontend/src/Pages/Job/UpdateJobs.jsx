import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../style/updateJobs.css";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateJobs = () => {
  const id = useParams().id;

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(
        `http://localhost:4000/api/v1/job/${id}`
      );
      setTitle(response.data.job.title);
      setDescription(response.data.job.description);
      setLocation(response.data.job.location);
      setSalary(response.data.job.salary);
      setExpired(response.data.job.expired);
    };
    fetchDetails();
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [expired, setExpired] = useState(true);

  const updateHandler = async (e) => {
    console.log(expired);
    e.preventDefault();
    const updatedJob = {
      title: title,
      description: description,
      location: location,
      salary: salary,
      expired: expired === "true" ? false : true,
    };
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/job/update/${id}`,
        updatedJob,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.updatedJob);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="update-job-container">
      <div className="job-form-container">
        <form action="">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Job Description"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Job Location"
          />
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Salary"
          />
          <div className="checkbox-container">
            <input
              type="radio"
              name="check"
              id="Active"
              value="true"
              checked = {expired === false || expired === "true"}
              onChange={(e) => setExpired(e.target.value)}
            />
            <label htmlFor="Active">Active</label>
            <input
              type="radio"
              name="check"
              id="Expired"
              value="false"
              checked = {expired === true || expired === "false"}
              onChange={(e) => setExpired(e.target.value)}
            />
            <label htmlFor="Inactive">Inactive</label>
          </div>
          <button
            type="submit"
            value="Update Job"
            className="submit-btn"
            onClick={(e) => updateHandler(e)}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobs;
