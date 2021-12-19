import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "../../components/Contexts/AuthContext";
import { useSocket } from "../../components/Contexts/SocketContextProvider";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [messages, setMessages] = useState(new Map());

  const { currentUser } = useContext(AuthContext);
  const { socket } = useSocket();

  const addMessageToState = useCallback(
    (to, msg) => {
      const newMessages = new Map(messages);
      const prev = newMessages.get(to) || {};
      const prevMessages = prev?.messages || [];
      newMessages.set(to, {
        newMessage: msg.message,
        messages: [...prevMessages, msg],
      });
      setMessages(newMessages);
    },
    [messages]
  );

  useEffect(() => {
    if (socket && currentUser) {
      socket.on("receive-message", (msg) => {
        console.log({ msg });
        if (msg.recepient.toLowerCase() === currentUser.name.toLowerCase()) {
          addMessageToState(msg.sender, msg);
        }
      });
    }
  }, [currentUser, socket, addMessageToState]);

  const sendMessage = (msg) => {
    addMessageToState(msg.recepient, msg);
    if (socket) socket.emit("send-message", msg);
  };

  return (
    <GlobalContext.Provider value={{ messages, sendMessage }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
