import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import "./style/common.css";
import { Toaster } from "react-hot-toast";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import toast from "react-hot-toast";
import StudentDashboard from "./Pages/StudentDashboard";
import AlumniDashboard from "./Pages/AlumniDashboard";
import CompanyDashboard from "./Pages/CompanyDashboard";
import axios from "axios";
import { Context } from "./main";
import ViewAlumni from "./Components/ViewAlumni";
import StudentDetails from "./Components/StudentDetails";
import UpdateProfileStudent from "./Components/UpdateProfileStudent";
import NotificationStudent from "./Components/NotificationStudent";

const App = () => {
  const navigateTo = useNavigate();
  const { user, setUser, authorised, setAuthorised, typeUser, setTypeUser } =
    useContext(Context);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/", {
          withCredentials: true,
        });
        const user = res.data.user;
        const role = res.data.role;
        if (user && role) {
          setUser(user);
          setAuthorised(true);
          setTypeUser(res.data.role);
          navigateTo(`/api/v1/${role}`);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
    if (!authorised) {
      navigateTo("/login");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/api/v1/student" element={<StudentDashboard />}>
          <Route index element={<StudentDetails />} />
          <Route path="dashboard" element={<StudentDetails />} />
          <Route path="alumni" element={<ViewAlumni />} />
          <Route path="update-profile" element={<UpdateProfileStudent />} />
          <Route path="notification" element={<NotificationStudent />} />
        </Route>
        <Route path="/api/v1/alumni" element={<AlumniDashboard />} />
        <Route path="/api/v1/company" element={<CompanyDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export { Context };
export default App;
