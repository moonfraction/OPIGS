import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../style/login.css";
import "../style/common.css";
import { Context } from "../main";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const { setUser, setAuthorised, setTypeUser, typeUser } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let temp;
    let roleSet;
    try {
      if (role === "student") {
        console.log(email, password);
        temp = await axios.post(
          "http://localhost:4000/api/v1/student/login",
          { email, password },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        roleSet = "student";
      } else if (role === "alumni") {
        temp = await axios.post(
          "http://localhost:4000/api/v1/alumni/login",
          { email, password },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        roleSet = "alumni";
      } else if (role === "company") {
        temp = await axios.post(
          "http://localhost:4000/api/v1/company/login",
          { email, password },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        roleSet = "company";
      }
      const showData = await temp.data;
      setUser(showData.user);
      setAuthorised(true);
      setTypeUser(roleSet);
      toast.success(showData.message);      
      navigateTo(`/api/v1/${roleSet}`,{replace:true});
    } catch (error) {
      toast.error(error.response.data.message);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="option-container">
          <button
            className={`option ${role === "student" ? "option-color" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`option ${role === "alumni" ? "option-color" : ""}`}
            onClick={() => setRole("alumni")}
          >
            Alumni
          </button>
          <button
            className={`option ${role === "company" ? "option-color" : ""}`}
            onClick={() => setRole("company")}
          >
            Company
          </button>
        </div>
        <div className="form-container">
          <form method="post">
            <input
              value={email}
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={(e) => handleLogin(e)}>
              Login
            </button>
          </form>
          <div className="register-option">
            <span>Not a user ?</span>
            <Link className="register-link" to="/register">Register</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
