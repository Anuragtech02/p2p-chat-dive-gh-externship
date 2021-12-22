import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "../auth/AuthContext";
import { database, firestore } from "../auth/firebase";
// import { useSocket } from "../../components/Contexts/SocketContextProvider";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState([]);
  const [currentChat, setCurrentChat] = useState({});

  const { currentUser, userDetails, allUsers, setAllUsers } =
    useContext(AuthContext);

  useEffect(() => {
    database.ref("online").on("value", (snapshot) => {
      const online = snapshot.val() || {};
      setOnlinePeople(online);
    });

    return () => {
      database.ref("online").off();
    };
  }, []);

  useEffect(() => {
    const db = firestore.collection("global").doc("global");
    const fetchAllUsers = async () => {
      const snapshot = await db.get();
      const allUsers = snapshot.data().users || [];
      setAllUsers(allUsers);
    };
    fetchAllUsers();
  }, [setAllUsers]);

  useEffect(() => {
    if (allUsers?.length || onlinePeople?.length) {
      const offline = allUsers.filter(
        (user) => !Object.values(onlinePeople).includes(user)
      );
      setOfflinePeople(offline);
    }
  }, [onlinePeople, allUsers]);

  useEffect(() => {
    if (currentUser?.email) {
      database.ref("messages").on("value", (snapshot) => {
        const messages = snapshot.val();
        setMessages(messages);
      });
    }

    return () => {
      database.ref("messages").off();
      if (Object.values(onlinePeople)?.length) {
        let keyToBeRemoved = null;
        for (let [key, val] of Object.entries(onlinePeople)) {
          if (val === currentUser?.email) {
            keyToBeRemoved = key;
            break;
          }
          console.log({ key, val, onlinePeople });
        }

        console.log({ keyToBeRemoved, currentUser });
        if (keyToBeRemoved) database.ref("online").remove(keyToBeRemoved);
      }
    };
  }, [currentUser, onlinePeople]);

  const sendMessage = (msg, isNew = false) => {
    database.ref(`messages/${msg.roomId}`).once("value", (snapshot) => {
      const msgs = snapshot.val() || [];
      msgs.push(msg);
      database.ref("messages").set(msgs);
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        messages,
        onlinePeople,
        offlinePeople,
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
