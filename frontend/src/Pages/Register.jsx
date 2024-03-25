import React, { useContext, useState } from "react";
import "../style/register.css";
import { Link } from "react-router-dom";
import { Context } from "../App";
import StudentRegister from "../Components/StudentRegister";
import AlumniRegister from "../Components/AlumniRegister";
import CompanyRegister from "../Components/CompanyRegister";

const Register = () => {
  const { user, setUser, authorised, setAuthorised } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  return (
    <div className="register-body">
      <div className="register-container">
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
          {role === "student" ? <StudentRegister /> : (role === "alumni" ? <AlumniRegister /> : <CompanyRegister />)}
        </div>
        <div className="login-option">
            <span>Already registered ?</span>
            <Link className="login-link" to="/login">
              Login
            </Link>
          </div>
      </div>
    </div>
  );
};

export default Register;
