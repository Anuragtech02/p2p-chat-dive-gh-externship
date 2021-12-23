import React, { useState, useContext, useEffect } from "react";
import styles from "./Sidebar.module.scss";
import SidebarActions from "./SidebarActions";
import { Search } from "react-feather";
import { Avatar } from "@material-ui/core";
import portraitIcon from "../../Assets/portrait.jpg";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import { AuthContext } from "../../utils/auth/AuthContext";
import { GlobalContext } from "../../utils/contexts/GlobalContext";
import { getUserData, creatRoom, getRoomId } from "../../utils/utils";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState("");
  const [users, setUsers] = useState();
  const [usersCopy, setUsersCopy] = useState();

  const navigate = useNavigate();
  const { name, room } = useParams();
  // const { roomData } = useSocket();
  const { allUsers, userDetails } = useContext(AuthContext);
  const { onlinePeople, setCurrentChat } = useContext(GlobalContext);

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
    setCurrent(name);
  }, [name]);

  useEffect(() => {
    console.log({ allUsers, onlinePeople });
    if (allUsers?.length) {
      setUsers(allUsers.map((chat) => getUserData(allUsers, chat.uid)));
    }
  }, [allUsers, onlinePeople]);

  // useEffect(() => {
  //   if (room?.length) {
  //     if (userDetails.chats.includes()) {
  //     }
  //   }
  // }, [room, userDetails]);

  // React.useEffect(() => {
  //   if (roomData?.room && currentUser?.name) {
  //     const data = roomData.users?.filter(
  //       (user) => user.name.toLowerCase() !== currentUser.name.toLowerCase()
  //     );
  //     setUsers(data);
  //     setUsersCopy(data);
  //   }
  // }, [roomData, currentUser]);

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
                    current === chat?.name ? styles.selectedChat : ""
                  )}
                >
                  <Avatar
                    variant="rounded"
                    style={{ background: "rgba(0,0,0,0.1)" }}
                    src={portraitIcon}
                    alt="profile-photo"
                  />
                  <div className={styles.chatUserInfo}>
                    <h6>{chat?.name}</h6>
                    {/* <p>{messages[room]?.newMessage}</p> */}
                    <span
                      className={clsx(
                        styles.status,
                        chat.status === "online"
                          ? styles.online
                          : styles.offline
                      )}
                    ></span>
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
