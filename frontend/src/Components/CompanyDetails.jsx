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
                    <p>
                        Name: <span>{user.name}</span>
                    </p>
                
            </div>
            <div className="detail">
                    <p>
                        Location: <span>{user.location}</span>
                    </p>
                   

            </div>
            <div className="detail">

                <p>
                Working Environment: <span>{user.workEnvironment}</span>
                </p> 
                
            </div>
            <div className="detail">
                
                <p>
                Recruitment Policy: <span>{user.recruitmentPolicy}</span>
                </p>  
                
            </div>
            <div className="detail">
                <p>
                Website: <span>{user.website}</span>
                </p> 
                   
            </div>
            <div className="detail">
                <p>
                Phone: <span>{user.phone}</span>
                </p>                    
            </div>
            <div className="detail">
                <p>
                Email: <span>{user.email}</span>
                </p>      
            </div>
        </div>
        </div>
        
    )
}
export default CompanyDetails;

