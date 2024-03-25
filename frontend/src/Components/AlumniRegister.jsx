import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AlumniRegister = () => {
  const navigateTo = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobProfile, setJobProfile] = useState("");
  const [jobBranch, setBranch] = useState("");
  const [profilePhoto, setImage] = useState("");

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

  const handleRegister = async (e) => {
    e.preventDefault();
    let temp = new FormData();
    temp.append("username", username);
    temp.append("email", email);
    temp.append("password", password);
    temp.append("phone", phone);
    temp.append("currentCompany", company);
    temp.append("jobProfile", jobProfile);
    temp.append("branch", jobBranch);
    temp.append("avatar", profilePhoto);

    try {
      const resp = await axios.post(
        "http://localhost:4000/api/v1/alumni/register",
        temp,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(resp.data.message);
      navigateTo("/login");
      setUserName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setCompany("");
      setJobProfile("");
      setBranch("");
      setImage("")
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <form method="post">
      <input
        type="text"
        placeholder="Name"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        type="text"
        placeholder="Job Profile"
        value={jobProfile}
        onChange={(e) => setJobProfile(e.target.value)}
      />
      <input
        type="text"
        placeholder="Branch"
        value={jobBranch}
        onChange={(e) => setBranch(e.target.value)}
      />
      <input
        id="file-upload"
        type="file"
        accept=".png, .jpeg, .jpg"
        onChange={handleFileUpload}
      />
      <button type="submit" onClick={handleRegister}>
        Register
      </button>
    </form>
  );
};

export default AlumniRegister;
