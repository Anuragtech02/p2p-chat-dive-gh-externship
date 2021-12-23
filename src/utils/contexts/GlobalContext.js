import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "../auth/AuthContext";
import { database, firestore } from "../auth/firebase";
import { getStatus } from "../utils";
// import { useSocket } from "../../components/Contexts/SocketContextProvider";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [onlinePeople, setOnlinePeople] = useState({});
  const [currentChat, setCurrentChat] = useState({});

  const { currentUser, userDetails, allUsers, setAllUsers } =
    useContext(AuthContext);

  useEffect(() => {
    database.ref("status").on("value", (snapshot) => {
      const all = snapshot.val() || {};
      setOnlinePeople(Object.values(all));
    });

    return () => {
      database.ref("status").off();
    };
  }, []);

  useEffect(() => {
    const db = firestore.collection("global").doc("global");
    const fetchAllUsers = async () => {
      const snapshot = await db.get();
      const all = snapshot.data().users || [];
      setAllUsers(
        all
          .filter((user) => user.uid !== currentUser.uid)
          .map((user) => ({
            ...user,
            status: getStatus(onlinePeople, user.uid),
          }))
      );
    };
    if (currentUser.email) {
      fetchAllUsers();
    }
  }, [setAllUsers, currentUser, onlinePeople]);

  useEffect(() => {
    if (currentUser?.email) {
      database.ref("messages").on("value", (snapshot) => {
        const messages = snapshot.val();
        setMessages(messages);
      });
    }

    return () => {
      database.ref("messages").off();
    };
  }, [currentUser]);

  useEffect(() => {
    console.log({ currentUser, userDetails, onlinePeople, allUsers });
  }, [currentUser, userDetails, onlinePeople, allUsers]);

  const sendMessage = async (msg, isNew = false) => {
    await database.ref("messages").child(msg.roomId).push(msg);
    console.log({ msg });
    if (
      userDetails.chats.findIndex((item) => item.roomId === msg.roomId) === -1
    ) {
      await firestore
        .collection("users")
        .doc(currentUser.uid)
        .update({
          chats: [
            ...userDetails.chats,
            { roomId: msg.roomId, uid: msg.recipient, name: msg.recipientName },
          ],
        });
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        messages,
        onlinePeople,
        sendMessage,
        currentChat,
        setCurrentChat,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
