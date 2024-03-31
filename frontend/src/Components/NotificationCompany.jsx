import React, { useContext, useState, useEffect } from "react";
import "../style/notificationCompany.css";
import { Context } from "../main";
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

const NotificationCompany = () => {
  const [generalNotif, setGeneralNotif] = useState([]);
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
  return (
    <div className="notif-container">
      <div className="notif">
        <h2>General Notifications</h2>
        {generalNotif &&
          generalNotif.map((notif) => (
            <NotificationCard title={notif.title} desc={notif.description} />
          ))}
      </div>
    </div>
  );
};
export default NotificationCompany;
