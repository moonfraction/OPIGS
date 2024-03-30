import React, { useContext } from "react";
import "../style/alumniDetails.css";
import { Context } from "../App";

const AlumniDetails = () => {
  const { user } = useContext(Context);
  return (
    <div className="alumni-details-container">
      <div className="upper">
        <div className="detail-container">
          <div className="detail">
            <h3>Name:</h3>
            <p>{user.username}</p>
          </div>
          <div className="detail">
            <h3>Email:</h3>
            <p>{user.email}</p>
          </div>
          <div className="detail">
            <h3>Phone:</h3>
            <p>{user.phone}</p>
          </div>          
          <div className="detail">
            <h3>Company:</h3>
            <p>{user.currentCompany}</p>
          </div>
          <div className="detail">
            <h3>Job Profile:</h3>
            <p>{user.jobProfile}</p>
          </div>
          <div className="detail">
            <h3>Branch:</h3>
            <p>{user.branch}</p>
          </div>
        </div>
        <div className="image-container">
          <img src={user.avatar} alt="" />
        </div>
      </div>
    </div>
  );
};

export default AlumniDetails;
