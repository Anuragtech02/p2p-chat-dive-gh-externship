import React, { useState, useContext, useEffect } from "react";
import styles from "./Login.module.scss";
import { Button, CircularProgress } from "@material-ui/core";
import { AuthContext } from "../Contexts/AuthContext";
import { withRouter } from "react-router-dom";
import short from "short-uuid";
import { useSocket } from "../Contexts/SocketContextProvider";

const Login = ({ history }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, handleChangeUser } = useContext(AuthContext);
  const { socket } = useSocket();

  useEffect(() => {
    if (currentUser?.name && room?.length && !loading) {
      if (socket) {
        socket.emit("join", { name, room });
      }
      history.push(`/${room}`);
    }
  }, [currentUser, history, loading, room, socket, name]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name?.trim().length) {
      alert("Please enter valid name");
      return;
    }
    const sUid = short.generate().slice(0, 10);
    if (!room?.trim().length) setRoom(sUid);
    setLoading(true);
    setTimeout(() => {
      handleChangeUser({ name, room: room || sUid });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h4>Realtime Chat</h4>
      <form onSubmit={onSubmit}>
        <p>Please Enter Following Details</p>
        <input
          value={name}
          type="text"
          disabled={loading}
          required
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          value={room}
          type="text"
          disabled={loading}
          placeholder="Room ID (optional)"
          onChange={(e) => setRoom(e.target.value)}
        />
        <span className={styles.helperText}>
          Leave empty to create a new room
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

export default withRouter(Login);
