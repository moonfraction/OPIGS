import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../style/adminLogin.css";
import "../style/common.css";
import { Context } from "../main";
import axios from "axios";
import toast from "react-hot-toast";

const AdminLogin = () => {
    const { setUser, setAuthorised, setTypeUser, typeUser } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role,setRole] = useState("admin");

    const navigateTo = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        let temp = new FormData();
        let roleSet = "admin";
        temp.append("email", email);
        temp.append("password", password);
        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/admin/login",
                temp,
                {
                    withCredentials: true,
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            );
            const showData = await response.data;
            setUser(showData.user);
            setAuthorised(true);
            setTypeUser(roleSet);
            toast.success(response.data.message);
            navigateTo("/api/v1/admin/dashboard");
        } catch (error) {
            toast.error(error.response.data.message);
            // setEmail("");
            // setPassword("");
        }
    }
    return (
        <div className="login-body">
            <div className="login-container">
                <div className="option-container">
                    <button className="option option-colour">
                        Admin
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
                </div>
            </div>

        </div>)
}

export default AdminLogin;
