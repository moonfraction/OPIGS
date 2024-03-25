import React, { useState } from "react";

const CompanyRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recruitmentPolicy, setRecruitmentPolicy] = useState("");
  const [workEnv, setWorkEnv] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");

  return <form method="post">
    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <input type="text" placeholder="Recruitment Policy" value={recruitmentPolicy} onChange={(e) => setRecruitmentPolicy(e.target.value)} />
    <input type="text" placeholder="Work Environment" value={workEnv} onChange={(e) => setWorkEnv(e.target.value)} />
    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
    <input type="text" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
    <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
    <input id="file-upload" type="file" accept=".png, .jpeg"/>
    <button type="submit">Register</button>
  </form>
};

export default CompanyRegister;
