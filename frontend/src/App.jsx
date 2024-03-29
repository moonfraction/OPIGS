import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Jobs from "./Pages/Job/Jobs.jsx";
import JobDetails from "./Pages/Job/JobDetails.jsx";
import Application from "./Pages/Application/Application.jsx"
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
    <Context.Provider
      value={{
        user,
        setUser,
        authorised,
        setAuthorised,
        typeUser,
        setTypeUser,
      }}
    >
      <Routes>
        <Route path="/api/v1/student" element={<StudentDashboard />}>
          <Route path="alumni" element={<ViewAlumni />} />
          <Route path="jobs" element = {<Jobs/>} />
          <Route path ="jobDetails/:id" element = {<JobDetails/>}/>
          <Route path ="postApplication/:id" element ={<Application/>} />
        </Route>
        <Route path="/api/v1/alumni" element={<AlumniDashboard />} />
        <Route path="/api/v1/company" element={<CompanyDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Context.Provider>
  );
};

export { Context };
export default App;
