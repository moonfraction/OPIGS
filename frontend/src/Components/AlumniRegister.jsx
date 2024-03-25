import React, { useState } from "react";

const AlumniRegister = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobProfile, setJobProfile] = useState("");
  const [jobBranch, setBranch] = useState("");
  return <form method="post">
    <input type="text" placeholder="Name" value={username} onChange={(e) => setUserName(e.target.value)} />
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
    <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
    <input type="text" placeholder="Job Profile" value={jobProfile} onChange={(e) => setJobProfile(e.target.value)} />
    <input type="text" placeholder="Branch" value={jobBranch} onChange={(e) => setBranch(e.target.value)} />
    <input id="file-upload" type="file" accept=".png, .jpeg"/>
    <button type="submit">Register</button>
  </form>
};

export default AlumniRegister;
