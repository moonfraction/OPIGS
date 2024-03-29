import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

export const Context = React.createContext();

const AppWrapper = () => {
  const [user, setUser] = useState({});
  const [authorised, setAuthorised] = useState(false);
  const [typeUser, setTypeUser] = useState("");
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
      <App />
    </Context.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </React.StrictMode>
);