import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import './style/common.css';
import { Toaster } from "react-hot-toast";
import Register from "./Pages/Register";
import toast from "react-hot-toast";

const Context = React.createContext();

const App = () => {
  const [user, setUser] = useState({});
  const [authorised, setAuthorised] = useState(false);

  const navigateTo = useNavigate();
  
  useEffect(() => {
    if (!authorised) {
      navigateTo("/register");
    }
  },[]);

  return (
    <Context.Provider value={{ user, setUser, authorised, setAuthorised }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />          
        <Route path="/register" element={<Register />} />          
      </Routes>
      <Toaster />
    </Context.Provider>
  );
};

export {Context};
export default App;
