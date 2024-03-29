import React, { useContext, useState } from "react";
import "../style/studentDetails.css";
import { Context } from "../main";
import toast from "react-hot-toast";

const Resume = ({ user,close }) => {
  return (
    <div className="resume-container" id="resume-box" >
      <div className="header">
        <h2>Resume</h2>
        <button className="close-button" onClick={() => {
          close(false);
        }}>X</button>
      </div>
      <div className="image">
        <img src={user.resume} alt="resume" />
      </div>
    </div>
  );
};

const StudentDetails = () => {
  const [modal, setModal] = useState(false);
  const { user } = useContext(Context);
  console.log(user);

  const handleCVModal = (e) => {
    if (user.resume === "") {
      toast.error("No CV uploaded yet");
    } else {
      setModal(true);
    }
  };
  return (
    <div className="student-details-container">
      {modal ? <Resume className="resume" user={user} close ={setModal} /> : ""}
      <div className={`upper ${
      modal ? "modal-open" : ""
    }`}>
        <div className="detail-container">
          <div className="detail">
            <h3>Name:</h3>
            <p>{user.name}</p>
          </div>
          <div className="detail">
            <h3>Email:</h3>
            <p>{user.email}</p>
          </div>
          <div className="detail">
            <h3>Roll Number:</h3>
            <p>{user.roll}</p>
          </div>
          <div className="detail">
            <h3>CGPA:</h3>
            <p>{parseFloat(user.CGPA)}</p>
          </div>
          <div className="detail">
            <h3>Branch:</h3>
            <p>{user.branch}</p>
          </div>
          <div className="detail">
            <h3>Branch:</h3>
            <p>{user.courseName}</p>
          </div>
          <div className="detail">
            <h3>Year Of Study:</h3>
            <p>{user.yearOfStudy}</p>
          </div>
          <div className="detail">
            <h3>Phone:</h3>
            <p>{user.phone}</p>
          </div>
        </div>
        <div className="image-container">
          <img src={user.profilePhoto} alt="" />
        </div>
      </div>
      <div className={`lower ${
      modal ? "modal-open" : ""
    }`}>
        <button className="show-cv-button" onClick={handleCVModal}>
          View CV
        </button>
      </div>
    </div>
  );
};

export default StudentDetails;
