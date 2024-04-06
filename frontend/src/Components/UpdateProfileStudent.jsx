import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import "../style/updateProfileStudent.css";
import { Context } from "../main";

const UpdateProfileStudent = () => {
  const [image, setImage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user, setUser } = useContext(Context);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    sendFileToBase(file);
  };
  const sendFileToBase = (file) => {
    const read = new FileReader();
    read.readAsDataURL(file);
    read.onload = () => {
      const base64 = read.result;
      setImage(base64);
    };
  };

  const handleUploadCV = async (e) => {
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
        const response = await axios.post("http://localhost:4000/api/v1/student/changePassword",{oldPassword,newPassword}, {
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

  return (
    <div className="update-profile-student">
      <h2>Upload your CV</h2>
      <form className="cv-upload-form" action="">
        <input
          id="upload-cv"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={handleFileUpload}
        />
        <div className="upload_cv_container">
        <label htmlFor="upload-cv" className="upload-cv">Select a file for CV</label>
        <img className="cv-image" src={image} alt="cv" />
        </div>
        <button type="submit" onClick={(e) => handleUploadCV(e)}>
          Upload
        </button>
      </form>
      <hr />
      <div className="update-password">
        <h2>Update Password</h2>
        <form action="">
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
            <button className="update-password-btn" onClick={(e) => handleUpdatePassword(e)}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileStudent;
