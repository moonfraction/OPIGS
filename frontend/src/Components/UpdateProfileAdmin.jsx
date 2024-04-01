import React,{useState,useContext}from 'react';
import axios from "axios";
import toast from "react-hot-toast";
import "../style/updateProfileAdmin.css";

const UpdateProfileAdmin =()=>{
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/v1/admin/update-password",{oldPassword,newPassword}, {
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
            console.log(error.response);
            setOldPassword("");
            setNewPassword("");
        }
      }
    return(
        <div className="update-profile-admin">
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
export default UpdateProfileAdmin;