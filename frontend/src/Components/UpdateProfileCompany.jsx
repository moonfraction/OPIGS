import React,{useState,useContext} from 'react';
import axios from "axios";
import toast from "react-hot-toast";
import "../style/updateProfileStudent.css";
import {Context} from "../App";

const UpdateProfileCompany = ()=>{
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const {user,setUser} = useContext(Context);
    
      const handleUploadLogo = async (e) => {
        e.preventDefault();
        let temp = new FormData();
        temp.append("cv", image);
        try {
          const response = await axios.post(
            "http://localhost:4000/api/v1/student/upload-cv",
            temp,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
              },
            }
          );
        //   console.log(response.d)
          setUser({ ...user, resume: response.data.student.resume });
          toast.success(response.data.message);
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
      };
    
    

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/v1/company/changePassword",{oldPassword,newPassword}, {
                withCredentials: true,
                headers:{
                    "Content-Type": "application/json",
                }
            })
            toast.success(response.data.message);
            setOldPassword("");
            setNewPassword("");
    
        } catch (error) {
            toast.error(error.response.data.message);
            setOldPassword("");
            setNewPassword("");
        }
      }
    
    return(
        <div className="update-profile-student">
         <div className="update-password">
            <h2>Update Password</h2>
            <form action="">
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                <button className="update-password-btn" onClick={(e) => handleUpdatePassword(e)}>Update</button>
            </form>
        </div>
        </div>
    )   
}
export default UpdateProfileCompany;
