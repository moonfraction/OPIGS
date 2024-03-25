import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import './style/common.css';
import { Toaster } from "react-hot-toast";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import toast from "react-hot-toast";

const Context = React.createContext();

const App = () => {
  const [user, setUser] = useState({});
  const [authorised, setAuthorised] = useState(false);

  const navigateTo = useNavigate();
  
  useEffect(() => {
    if (!authorised) {
      navigateTo("/login");
    }
  },[]);

  return (
    <Context.Provider value={{ user, setUser, authorised, setAuthorised }}>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />          
        <Route path="/register" element={<Register />} />          
        <Route path="*" element={<NotFound />} />          
      </Routes>
      <Toaster />
    </Context.Provider>
  );
};

export {Context};
export default App;
