import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  //Set current user to state and localstorage
  const handleChangeUser = (user) => {
    setCurrentUser({ name: user.name, room: user.room });
    localStorage.setItem("rc-curr-user", JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ currentUser, handleChangeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
