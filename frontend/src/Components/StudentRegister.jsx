import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StudentRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [courseName, setCourseName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [address, setAddress] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [profilePhoto, setImage] = useState("");

  const handleFileUpload = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(profilePhoto);
    let temp = new FormData();
    temp.append("name", name);
    temp.append("email", email);
    temp.append("password", password);
    temp.append("phone", phone);
    temp.append("branch", branch);
    temp.append("courseName", courseName);
    temp.append("yearOfStudy", yearOfStudy);
    temp.append("address", address);
    temp.append("CGPA", cgpa);
    temp.append("profilePhoto", profilePhoto);

    try {
      const resp = await axios.post(
        "http://localhost:4000/api/v1/student/register",
        temp,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(resp.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setBranch("");
      setCourseName("");
      setYearOfStudy("");
      setAddress("");
      setCgpa("");
      setAvatar("");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <form method="POST" action="/api/v1/student/register" enctype="multipart/form-data">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        placeholder="Branch"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
      />
      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Year of Study"
        value={yearOfStudy}
        onChange={(e) => setYearOfStudy(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="CGPA"
        value={cgpa}
        onChange={(e) => setCgpa(e.target.value)}
      />
      <input id="file-upload" name="profilePhoto" type="file" accept=".png, .jpeg" onChange={handleFileUpload}/>
      <button type="submit" onClick={handleRegister}>
        Register
      </button>
    </form>
  );
};

export default StudentRegister;
