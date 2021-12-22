import React, { useState, useContext } from "react";
import styles from "./Sidebar.module.scss";
import SidebarActions from "./SidebarActions";
import { Search } from "react-feather";
import { Avatar } from "@material-ui/core";
import portraitIcon from "../../Assets/portrait.jpg";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import { AuthContext } from "../../utils/auth/AuthContext";
import { GlobalContext } from "../../utils/contexts/GlobalContext";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState("");
  const [users, setUsers] = useState();
  const [usersCopy, setUsersCopy] = useState();

  const navigate = useNavigate();

  const handleClickChat = (name) => {
    navigate(`/${room}/chat/${name}`);
  };

  const { name, room } = useParams();
  // const { roomData } = useSocket();
  const { currentUser } = useContext(AuthContext);
  const { messages } = useContext(GlobalContext);

  React.useEffect(() => {
    setCurrent(name);
  }, [name]);

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
          {usersCopy?.length ? (
            usersCopy.map((chat, i) => (
              <div
                onClick={() => handleClickChat(chat.name)}
                key={i}
                className={clsx(
                  styles.chat,
                  current === chat.name ? styles.selectedChat : ""
                )}
              >
                <Avatar
                  variant="rounded"
                  style={{ background: "rgba(0,0,0,0.1)" }}
                  src={portraitIcon}
                  alt="profile-photoo"
                />
                <div className={styles.chatUserInfo}>
                  <h6>{chat.name}</h6>
                  <p>{messages?.get(chat.name)?.newMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <span>
              <p>No chats yet</p>
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
