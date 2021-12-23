import React, { useContext } from "react";
import styles from "./SidebarActions.module.scss";
import { MessageCircle, LogOut, Copy } from "react-feather";
import { IconButton, Avatar, Tooltip, makeStyles } from "@material-ui/core";
import portrait from "../../Assets/portrait.jpg";
import { useParams } from "react-router-dom";
import { auth, firebase } from "../../utils/auth/firebase";
import { AuthContext } from "../../utils/auth/AuthContext";

const SidebarActions = () => {
  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);

  const { room } = useParams();

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(room);
  };

  const actions = [
    {
      name: "Logout",
      icon: LogOut,
      onClick: async () => {
        await firebase
          .database()
          .ref("/status/" + currentUser.uid)
          .update({ state: "offline" });
        auth.signOut();
      },
    },
    {
      name: "Chat",
      icon: MessageCircle,
      onClick: () => {},
    },
    {
      name: "Copy Link",
      icon: Copy,
      onClick: handleCopyLink,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h4>RC</h4>
      </div>
      <div className={styles.actions}>
        {actions.map((item) => (
          <div key={item.name} className={styles.actionItem}>
            <Tooltip title={item.name} placement="right">
              <IconButton
                style={{
                  background:
                    item.name === "Chat"
                      ? "var(--secondaryColor)"
                      : "transparent",
                }}
                onClick={item.onClick}
              >
                <item.icon
                  color={
                    "Chat" === item.name ? "white" : "rgba(255,255,255,0.8)"
                  }
                />
              </IconButton>
            </Tooltip>
          </div>
        ))}
      </div>
      <div className={styles.account}>
        <Avatar
          variant="rounded"
          alt="profile"
          src={portrait}
          className={classes.medium}
        >
          CA
        </Avatar>
      </div>
    </div>
  );
};

export default SidebarActions;

const useStyles = makeStyles((theme) => ({
  medium: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));
