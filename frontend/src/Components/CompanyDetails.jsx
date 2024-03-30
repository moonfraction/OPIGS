import React,{useContext} from 'react';
import {Context} from '../main'
import toast from "react-hot-toast";
import "../style/companyDetails.css";

const CompanyDetails =() =>{
    const {user} = useContext(Context);
    return(
        <div className="company-details-container">
            <div className="detail-container">
            <div className="detail">
                    <h3>Name: </h3>
                    <p>{user.name}</p>
                
            </div>
            <div className="detail">
                
                    <h3>Location: </h3>
                    <p>{user.location}</p>

            </div>
            <div className="detail">

                    <h3>Working Environment: </h3>
                    <p>{user.workEnvironment}</p>
                
            </div>
            <div className="detail">
                
                    <h3>Recruiting Policy: </h3>
                    <p>{user.recruitmentPolicy}</p>
                
            </div>
            <div className="detail">
                
                    <h3>Website: </h3>
                    <p>{user.website}</p>

            </div>
            <div className="detail">

                    <h3>Phone: </h3>
                    <p>{user.phone}</p>
            </div>
            <div className="detail">
                    <h3>Email: </h3>
                    <p>{user.email}</p>
            </div>
        </div>
        </div>
        
    )
}
export default CompanyDetails;

