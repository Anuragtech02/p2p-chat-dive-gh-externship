import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./ChatArea.module.scss";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { Check, Send, Smile } from "react-feather";
import { GlobalContext } from "../../utils/contexts/GlobalContext";
import { AuthContext } from "../../utils/auth/AuthContext";
// import { useSocket } from "../Contexts/SocketContextProvider";
import clsx from "clsx";
import moment from "moment";
import short from "short-uuid";

// const ENDPOINT = "http://localhost:5000/";

const ChatArea = () => {
  const { room } = useParams();
  const [anchor, setAnchor] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const textAreaRef = useRef();

  const textAreaAdjust = () => {
    textAreaRef.current.style.height = "1px";
    textAreaRef.current.style.height =
      15 + textAreaRef.current.scrollHeight + "px";
  };

  const onEmojiClick = (e, emoji) => {
    e.stopPropagation();
    setMessage((curr) => curr + emoji.emoji);
  };

  const handleClickEmoji = (e) => {
    setAnchor(e.currentTarget);
  };
  const handleClose = () => {
    setAnchor(null);
  };
  const { messages, sendMessage, currentChat, setCurrentChat } =
    useContext(GlobalContext);
  const { userDetails, allUsers } = useContext(AuthContext);
  // const { socket, setRoomData } = useSocket();

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("FCon");
  //   });
  //   socket.on("room-data", (data) => {
  //     console.log({ data });
  //     setRoomData(data);
  //   });
  // }, [socket, setRoomData]);

  useEffect(() => {
    if (room?.length && userDetails?.email) {
      let usr = userDetails.chats.find((item) => item.roomId === room);
      if (usr) {
        setCurrentChat({
          name: usr.name,
          uid: usr.uid,
        });
      }
    }
  }, [room, userDetails, setCurrentChat]);

  useEffect(() => {
    setName(currentChat?.name);
  }, [currentChat]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const newMessage = {
      id: `${room}_MSG${short().new()}`,
      author: userDetails.uid,
      recipient: currentChat.uid,
      recipientName: currentChat.name,
      roomId: room,
      message,
      isSent: true,
      isRead: false,
      isDelivered: false,
      createdAt: new Date().toISOString(),
    };

    sendMessage(newMessage);
    setMessage("");
  };

  const handleEnter = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      handleMessageSubmit(e);
    }
  };

  useEffect(() => {
    console.log(messages);
  }, [messages, room]);

  return (
    <div className={styles.container}>
      <Topbar name={name} />
      <div className={styles.chatArea}>
        <div className={styles.viewArea}>
          {messages &&
            messages[room] &&
            Object.values(messages[room])?.map((msg, i) => (
              <MessageComponent
                key={i}
                msg={msg}
                cls={
                  msg.author === userDetails?.uid
                    ? styles.sender
                    : styles.receiver
                }
                displayStatus={msg.author === userDetails?.uid}
              />
            ))}
        </div>
        <form onSubmit={handleMessageSubmit} className={styles.inputArea}>
          <textarea
            ref={textAreaRef}
            onKeyUp={textAreaAdjust}
            onKeyPress={handleEnter}
            name="chat"
            rows="1"
            disabled={Boolean(!name)}
            required
            placeholder={
              name?.length
                ? "Enter something"
                : "Please select a contact to start"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className={styles.actionBtns}>
            <IconButton type="submit" disabled={Boolean(!name)}>
              <Send />
            </IconButton>
            <div className={styles.selectEmoji}>
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClickEmoji}
              >
                <Smile />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchor}
                keepMounted
                open={Boolean(anchor)}
                onClose={handleClose}
                disablePortal={Boolean(!name)}
                hidden={Boolean(!name)}
              >
                <MenuItem disabled={Boolean(!name)} onClick={handleClose}>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={styles.emojiPicker}
                  >
                    <Picker
                      onEmojiClick={onEmojiClick}
                      disableAutoFocus={true}
                      skinTone={SKIN_TONE_MEDIUM_DARK}
                      groupNames={{ smileys_people: "PEOPLE" }}
                      native
                    />
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;

const Topbar = ({ name }) => {
  return (
    <nav className={styles.topbar}>
      <h4>{name || "Chat Here"}</h4>
    </nav>
  );
};

const MessageComponent = ({ msg, cls, displayStatus }) => {
  const { updateMessageAsRead } = useContext(GlobalContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (msg.id) {
      if (
        (msg.isSent || msg.isDelivered) &&
        !msg.isRead &&
        msg.author !== currentUser.uid
      ) {
        updateMessageAsRead(msg.roomId, msg.id);
      }
    }
  }, [msg, updateMessageAsRead, currentUser]);

  return (
    <div className={clsx(styles.message, cls)}>
      <div className={styles.msgInner}>
        <p style={{ marginRight: displayStatus ? "2.5rem" : "0px" }}>
          {msg.message}
        </p>
        {displayStatus && (
          <span className={styles.messageStatus}>{getMessagStaus(msg)}</span>
        )}
      </div>
      {/* <span>{msg.date}</span> */}
    </div>
  );
};

const getMessagStaus = (msg) => {
  if (!msg) return;
  if (msg.isRead) {
    return (
      <span className={styles.read}>
        <Check fontSize="5px" color="white" />
        <Check fontSize="5px" color="white" />
      </span>
    );
  }
  if (msg.isDelivered) {
    return (
      <span className={styles.delivered}>
        <Check fontSize="5px" />
        <Check fontSize="5px" />
      </span>
    );
  }
  if (msg.isSent) {
    return (
      <span className={styles.sent}>
        <Check fontSize="5px" />
      </span>
    );
  }
};
