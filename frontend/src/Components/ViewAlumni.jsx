import React, { useEffect, useState } from "react";
import "../style/viewAlumni.css";
import axios from "axios";
import toast from "react-hot-toast";

const handleSendRequest = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/student/requestAlumni/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const AlumniCard = ({ alum }) => {
  // console.log(alum);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const showAlum = async () => {
      const check = await axios.get(
        `http://localhost:4000/api/v1/student/checkAlumni/${alum._id}`,
        {
          withCredentials: true,
        }
      );
      if (check.data.show === true) {
        setShow(true);
      };
    } 
    showAlum();
  });

  return (
    <div className={
      `${show === false ? "hide-card":""} alum-data-container`
    }>
      <div className="alum-left">
        <div className="alum-img">
          <img src={alum.avatar} alt="" />
        </div>
        <div className="alum-detail">
          <h3>{alum.username}</h3>
          <h3>{alum.currentCompany}</h3>
        </div>
      </div>
      <div className="alum-right">
        <button onClick={() => handleSendRequest(alum._id)}>
          Send Request
        </button>
      </div>
    </div>
  );
};

const ViewAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/alumni/getall",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setAlumni(response.data.alum_data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlumni();
  }, []);
  return (
    <div className="view-alumni-container">
      {alumni.map((alum,idx) => {
        return <AlumniCard alum={alum} key ={idx}/>;
      })}
    </div>
  );
};

export default ViewAlumni;
