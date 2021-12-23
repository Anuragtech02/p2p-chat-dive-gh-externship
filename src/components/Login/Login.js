import React, { useState, useContext, useEffect } from "react";
import styles from "./Login.module.scss";
import { Button, CircularProgress } from "@material-ui/core";
import { AuthContext } from "../../utils/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const navigate = useNavigate();

  const { currentUser, handleClickLogin, createNewUser } =
    useContext(AuthContext);

  useEffect(() => {
    if (currentUser?.email) {
      navigate(`/`);
    }
  }, [currentUser, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email?.trim().length) {
      alert("Please enter valid email");
      setLoading(false);
      return;
    }

    if (!isNewUser) {
      handleClickLogin(email, password, (err) => {
        setLoading(false);
        if (err) {
          if (err?.toString()?.includes("no user record")) {
            alert("User not found");
          } else {
            alert("Some error occured");
          }
          console.error(err);
          setLoading(false);
        }
      });
    } else {
      createNewUser(name, email, password, (err) => {
        setLoading(false);
        if (err) {
          alert("Some error occured");
          console.error(err);
          setLoading(false);
        }
      });
    }
  };

  return (
    <div className={styles.container}>
      <h4>Realtime Chat</h4>
      <form onSubmit={onSubmit}>
        <p>Please Enter Following Details</p>
        {isNewUser && (
          <input
            value={name}
            type="text"
            required
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          value={email}
          type="email"
          required
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={password}
          type="password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className={styles.helperText}
          onClick={() => setIsNewUser(!isNewUser)}
        >
          {isNewUser ? "Login" : "New User?"}
        </span>
        <Button className={styles.submitBtn} variant="text" type="submit">
          Submit
        </Button>
        <div
          className={styles.loading}
          style={{ visibility: loading ? "visible" : "hidden" }}
        >
          <CircularProgress />
        </div>
      </form>
    </div>
  );
};

export default Login;
