import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CompanyRegister = () => {
  const navigateTo = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recruitmentPolicy, setRecruitmentPolicy] = useState("");
  const [workEnv, setWorkEnv] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setImage] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    sendFileToBase(file);
  };

  const sendFileToBase = (file) =>{
    const read = new FileReader();
    read.readAsDataURL(file);
    read.onload = () => {
      const base64 = read.result;
      setImage(base64);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    let temp = new FormData();
    temp.append("name", name);
    temp.append("email", email);
    temp.append("password", password);
    temp.append("phone", phone);
    temp.append("recruitmentPolicy", recruitmentPolicy);
    temp.append("workEnvironment", workEnv);
    temp.append("location", location);
    temp.append("website", website);
    temp.append("logo", profilePhoto);

    try {
      const resp = await axios.post(
        "http://localhost:4000/api/v1/company/register",
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
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRecruitmentPolicy("");
      setWorkEnv("");
      setLocation("");
      setWebsite("");
      setImage("");

    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return <form method="post">
    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <input type="text" placeholder="Recruitment Policy" value={recruitmentPolicy} onChange={(e) => setRecruitmentPolicy(e.target.value)} />
    <input type="text" placeholder="Work Environment" value={workEnv} onChange={(e) => setWorkEnv(e.target.value)} />
    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
    <input type="text" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
    <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
    <input id="file-upload" type="file" accept=".png, .jpeg, .jpg" onChange={handleFileUpload}/>
    <button type="submit" onClick={(e) => handleRegister(e)}>Register</button>
  </form>
};

export default CompanyRegister;
