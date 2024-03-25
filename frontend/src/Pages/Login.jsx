import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../style/login.css";
import "../style/common.css";
import { Context } from "../App";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const { user, setUser, authorised, setAuthorised } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = async (e) => {
    e.preventDefault();
    let temp;
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
      }
      toast.success(temp.data.message);
      setUser(temp.data.user);
      setAuthorised(true);
      console.log(user,authorised);
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
