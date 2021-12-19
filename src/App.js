import React from "react";
import styles from "./App.module.scss";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Login, ChatArea, Sidebar } from "./components";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AuthContextProvider from "./components/Contexts/AuthContext";
import GlobalContextProvider from "./utils/contexts/GlobalContext";
import SocketContextProvider from "./utils/contexts/SocketContextProvider";

const App = () => {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <Router>
          <div className={styles.container}>
            <Switch>
              <Route path="/" exact component={Login} />
              <GlobalContextProvider>
                <PrivateRoute
                  path="/:room"
                  exact
                  component={() => <WithSidebar component={ChatArea} />}
                />
                <PrivateRoute
                  path="/:room/chat/:name"
                  exact
                  component={() => <WithSidebar component={ChatArea} />}
                />
              </GlobalContextProvider>
            </Switch>
          </div>
        </Router>
      </SocketContextProvider>
    </AuthContextProvider>
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
