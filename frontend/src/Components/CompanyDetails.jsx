import React, { useContext } from "react";
import { Context } from "../main";
import toast from "react-hot-toast";
import "../style/companyDetails.css";
import axios from "axios";

const CompanyDetails = () => {
  const sendRequest = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/company/apply",
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const { user } = useContext(Context);
  return (
    <div className="company-details-container">
      <div className="detail-container">
        <div className="company-detail">
          <p>
            Name: <span>{user.name}</span>
          </p>
        </div>
        <div className="company-detail">
          <p>
            Location: <span>{user.location}</span>
          </p>
        </div>
        <div className="company-detail">
          <p>
            Working Environment: <span>{user.workEnvironment}</span>
          </p>
        </div>
        <div className="company-detail">
          <p>
            Recruitment Policy: <span>{user.recruitmentPolicy}</span>
          </p>
        </div>
        <div className="company-detail">
          <p>
            Website: <span>{user.website}</span>
          </p>
        </div>
        <div className="company-detail">
          <p>
            Phone: <span>{user.phone}</span>
          </p>
        </div>
        <div className="company-detail">
          <p>
            Email: <span>{user.email}</span>
          </p>
        </div>
        <div className="company-detail">
          <button onClick={sendRequest}>Send Request</button>
        </div>
      </div>
    </div>
  );
};
export default CompanyDetails;
