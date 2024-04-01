import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import Jobs from "./Pages/Job/Jobs.jsx";
import JobDetails from "./Pages/Job/JobDetails.jsx";
import Application from "./Pages/Application/Application.jsx";
import "./style/common.css";
import { Toaster } from "react-hot-toast";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import toast from "react-hot-toast";
import StudentDashboard from "./Pages/DashBoard/StudentDashboard.jsx";
import AlumniDashboard from "./Pages/DashBoard/AlumniDashboard.jsx";
import CompanyDashboard from "./Pages/DashBoard/CompanyDashboard.jsx";
import axios from "axios";
import { Context } from "./main";
import ViewAlumni from "./Components/ViewAlumni";
import NotificationStudent from "./Components/NotificationStudent";
import AlumniDetails from "./Components/AlumniDetails";
import StudentDetails from "./Components/StudentDetails";
import UpdateProfileStudent from "./Components/UpdateProfileStudent";
import CompanyDetails from "./Components/CompanyDetails.jsx";
import MyJobs from "./Pages/Job/MyJobs.jsx";
import UpdateProfileCompany from "./Components/UpdateProfileCompany.jsx";
import MyApplication from "./Pages/Application/MyApplications.jsx";
import PostJob from "./Pages/Job/PostJob.jsx";
import NotificationCompany from "./Components/NotificationCompany.jsx";
import UpdateProfileAlumni from "./Components/UpdateProfileAlumni.jsx";
import ViewRequestAlumni from "./Components/ViewRequestAlumni.jsx";
import ViewStudentDetails from "./Components/ViewStudentDetails.jsx";
import Chat from "./Chat/Chat";


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
          <Route path="chat" element={<Chat />} />

          <Route path="jobs" element={<Jobs />} />
          <Route path="jobDetails/:id" element={<JobDetails />} />
          <Route path="postApplication/:id" element={<Application />} />
          <Route path="update-profile" element={<UpdateProfileStudent />} />
          <Route path="notification" element={<NotificationStudent />} />
        </Route>
        <Route path="/api/v1/alumni" element={<AlumniDashboard />}>
          <Route index element={<AlumniDetails />} />
          <Route path="dashboard" element={<AlumniDetails />} />
          <Route path="update-profile" element={<UpdateProfileAlumni />} />
          <Route path="view-request" element={<ViewRequestAlumni />} />
          <Route path="chat" element={<Chat />} />
        </Route>

        <Route path="/api/v1/company" element={<CompanyDashboard />}>
          <Route index element={<CompanyDetails />} />
          <Route path="dashboard" element={<CompanyDetails />} />
          <Route path="update-profile" element={<UpdateProfileCompany />} />
          <Route path="my-applications" element={<MyApplication />} />
          <Route path="notification" element={<NotificationCompany />} />
          <Route path="my-posted-jobs" element={<MyJobs />} />
          <Route path="post-new-job" element={<PostJob />} />
          <Route path="view-all-students" element={<ViewStudentDetails />} />
        </Route>

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
