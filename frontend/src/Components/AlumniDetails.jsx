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
            <h3>Name:</h3>
            <p>{user.name}</p>
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
