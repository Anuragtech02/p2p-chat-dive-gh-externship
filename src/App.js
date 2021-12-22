import React from "react";
import styles from "./App.module.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login, ChatArea, Sidebar } from "./components";
import PrivateRoute from "./utils/auth/PrivateRoute";
import { AuthProvider } from "./utils/auth/AuthContext";
import GlobalContextProvider from "./utils/contexts/GlobalContext";

const App = () => {
  return (
    <AuthProvider>
      <GlobalContextProvider>
        <Router>
          <div className={styles.container}>
            <Routes>
              <Route path="/login" exact element={<Login />} />
              <Route
                path="/"
                exact
                element={
                  <PrivateRoute>
                    <WithSidebar component={ChatArea} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/:room"
                exact
                element={
                  <PrivateRoute>
                    <WithSidebar component={ChatArea} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </GlobalContextProvider>
    </AuthProvider>
  );
};

export default App;

const WithSidebar = ({ component: Component }) => {
  return (
    <>
      <Sidebar />
      <Component />
    </>
  );
};
