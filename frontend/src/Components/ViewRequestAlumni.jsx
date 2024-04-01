import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../style/viewRequestAlumni.css";

const RequestCard = ({ ele }) => {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/student/${ele.student}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response.data);
        setName(response.data.student.name);
        setBranch(response.data.student.branch);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudent();
  },[] );

  const handleAccept = async () =>{
    try {
        const response = await axios.get(`http://localhost:4000/api/v1/alumni/request/${ele._id}/approve`,{
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        })
        const response2 = await axios.post(`http://localhost:4000/api/v1/conversations`,{
            senderId: ele.alumni,
            receiverId: ele.student
      },{
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        })        
        toast.success(response.data.message, response2.data.message);
    } catch (error) {
        toast.error(error.response.data.message, error.response2.data.message);
    }
  }

  const handleReject = async() =>{
    try {
        const response = await axios.delete(`http://localhost:4000/api/v1/alumni/request/${ele._id}/delete`,{
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        })
        toast.success(response.data.message);
    } catch (error) {
        toast.error(error.response.data.message);
    }
  }

  return (
    <div className="request-card">
      <div className="left">
        <h3>{name}</h3>
        <p>{branch}</p>
      </div>
      <div className="right">
        <button className="accept" onClick={handleAccept}>Accept</button>
        <button className="reject" onClick={handleReject}>Reject</button>
      </div>
    </div>
  );
};

const ViewRequestAlumni = () => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/alumni/requests",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setRequests(response.data.requests);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchRequests();
  });
  return (
    <div className="view-request-container">
      {requests.map((request) => {
        return <RequestCard ele={request} />;
      })}
    </div>
  );
};

export default ViewRequestAlumni;
