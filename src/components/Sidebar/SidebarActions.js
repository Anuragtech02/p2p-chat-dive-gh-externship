import React, { useState } from "react";
import styles from "./SidebarActions.module.scss";
import { MessageCircle, User, Copy } from "react-feather";
import { IconButton, Avatar, Tooltip, makeStyles } from "@material-ui/core";
import portrait from "../../Assets/portrait.jpg";
import { useParams } from "react-router-dom";

const SidebarActions = () => {
  const classes = useStyles();
  const [current, setCurrent] = useState("Chat");

  const { room } = useParams();

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(room);
  };

  const actions = [
    {
      name: "Account",
      icon: User,
      onClick: () => {},
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
                    current === item.name
                      ? "var(--secondaryColor)"
                      : "transparent",
                }}
                onClick={item.onClick}
              >
                <item.icon
                  color={
                    current === item.name ? "white" : "rgba(255,255,255,0.8)"
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
