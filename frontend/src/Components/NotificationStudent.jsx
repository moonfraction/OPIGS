import React, { useEffect, useState } from "react";
import "../style/notificationStudent.css";
import toast from "react-hot-toast";
import axios from "axios";

const NotificationCard = ({title, desc}) => {
    return (
        <div className="notif-card">
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    )

}

const NotificationStudent = () => {
  const [generalNotif, setGeneralNotif] = useState([]);
  const [jobNotif, setJobNotif] = useState([]);
  const [selectionNotif, setSelectionNotif] = useState([]);

  useEffect(() => {
    try {
      const fetchGeneralNotif = async () => {
        const response = await axios.get(
          "http://localhost:4000/api/v1/notification/general",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setGeneralNotif(response.data.generalNotif);
      };
      fetchGeneralNotif();
    } catch (error) {
        toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchJobNotif = async () => {
        const response = await axios.get(
          "http://localhost:4000/api/v1/notification/job-post",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.newJobs);
        setJobNotif(response.data.newJobs);
      };
      fetchJobNotif();
    } catch (error) {
        toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchSelectionNotif = async () => {
        const response = await axios.get(
          "http://localhost:4000/api/v1/application/approved",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSelectionNotif(response.data.applications);
      };
      fetchSelectionNotif();
    } catch (error) {
        toast.error(error.response.data.message);
    }
  }, []);

  return (
    <div className="notif-container">
        <div className="notif-stu adm-notif">
            <h2>General Notifications</h2>
            {generalNotif && generalNotif.map((notif) => (
                <NotificationCard title={notif.title} desc={notif.description}/>
            ))}
            {jobNotif && jobNotif.map((notif) => (
                <NotificationCard title={notif.company} desc={notif.title}/>
            ))}
        </div>
        <div className="notif-stu selection-notif">
            <h2>Selection Notifications</h2>
            {selectionNotif && selectionNotif.map((notif) => (
                <NotificationCard title={notif.companyName} desc="You have been approved"/>
            ))}
        </div>
    </div>
  )
};

export default NotificationStudent;
