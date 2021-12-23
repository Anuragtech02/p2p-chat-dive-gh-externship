import React, { useState, useContext, useEffect } from "react";
import styles from "./Sidebar.module.scss";
import SidebarActions from "./SidebarActions";
import { Search } from "react-feather";
import { Avatar } from "@material-ui/core";
import portraitIcon from "../../Assets/portrait.jpg";
import { useNavigate } from "react-router";
import clsx from "clsx";
import { AuthContext } from "../../utils/auth/AuthContext";
import { GlobalContext } from "../../utils/contexts/GlobalContext";
import { getUserData, creatRoom, getRoomId } from "../../utils/utils";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState();
  const [usersCopy, setUsersCopy] = useState();

  const navigate = useNavigate();

  const { allUsers, userDetails } = useContext(AuthContext);
  const { onlinePeople, setCurrentChat, currentChat, messages } =
    useContext(GlobalContext);

  const handleClickChat = (name, email, uid) => {
    let roomId = getRoomId(email, userDetails.chats);
    if (roomId?.length) {
      setCurrentChat({ name, uid });
      navigate(`/${roomId}`);
      return;
    }

    roomId = creatRoom([userDetails.uid, uid]);
    setCurrentChat({ name, uid });
    navigate(`/${roomId}`);
  };

  useEffect(() => {
    if (allUsers?.length) {
      let tempUsers = allUsers.map((chat) => getUserData(allUsers, chat.uid));
      setUsersCopy(tempUsers);
      setUsers(tempUsers);
    }
  }, [allUsers, onlinePeople]);

  useEffect(() => {
    if (search?.length) {
      setUsers(usersCopy.filter((user) => user.name.includes(search)));
    } else {
      setUsers(usersCopy);
    }
  }, [search, usersCopy]);

  return (
    <aside className={styles.container}>
      <div className={styles.actionsContainer}>
        <SidebarActions />
      </div>

      <div className={styles.detailSide}>
        <div className={styles.search}>
          <Search color="rgba(0,0,0,0.6)" size="1.2rem" />
          <input
            type="text"
            name="search"
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.chats}>
          <h6>My Chats</h6>
          {users?.length ? (
            users
              .map((chat) => getUserData(users, chat.uid))
              .map((chat, i) => (
                <div
                  onClick={() =>
                    handleClickChat(chat?.name, chat?.email, chat?.uid)
                  }
                  key={i}
                  className={clsx(
                    styles.chat,
                    currentChat?.name === chat?.name ? styles.selectedChat : ""
                  )}
                >
                  <Avatar
                    variant="rounded"
                    style={{ background: "rgba(0,0,0,0.1)" }}
                    src={portraitIcon}
                    alt="profile-photo"
                  />
                  <div className={styles.chatUserInfo}>
                    <div style={{ width: "100%" }} className={styles.flexRow}>
                      <h6>{chat?.name}</h6>
                      <span
                        className={clsx(
                          styles.status,
                          chat.status === "online"
                            ? styles.online
                            : styles.offline
                        )}
                      ></span>
                    </div>
                    <p>
                      {getLastMessage(messages, userDetails.chats, chat?.uid)}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <span className={styles.noChats}>
              <p>No chats yet</p>
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

const getLastMessage = (messages, chats, uid) => {
  if (messages) {
    let tempChat = chats.find((item) => item.uid === uid);
    if (tempChat?.roomId) {
      let chats = Object.values(messages[tempChat.roomId]);
      return chats[chats.length - 1]?.message?.slice(0, 10) + "...";
    }
  }
  return "";
};
