import { createContext, useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { auth, database, firebase, firestore } from "./firebase";
import styles from "./auth.module.scss";
import { v4 as uuid } from "uuid";

export const AuthContext = createContext({});

const GLOBAL_REF = firestore.collection("global").doc("global");

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [pending, setPending] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();

    const fetchUser = async (user) => {
      const userRef = db.collection("users").where("email", "==", user.email);
      const snapshot = await userRef.get();
      const userData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setUserDetails(userData[0]);
      await database.ref("online").push(userData[0].email);
      setPending(false);
    };
    const checkUser = () => {
      firebase.auth().onAuthStateChanged((user) => {
        // const { email, displayName } = { ...user };
        setCurrentUser(user);
        if (user && user?.email?.length) fetchUser(user);
        else setPending(false);
      });
    };
    checkUser();
  }, []);

  if (pending) {
    return (
      <div className={styles.container}>
        <CircularProgress className={styles.circularProgress} />
      </div>
    );
  }

  async function handleClickLogin(email, password, cb) {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      if (cb) cb();
    } catch (error) {
      if (cb) cb(error);
    }
  }

  async function getAllUsers() {
    return await GLOBAL_REF.get();
  }

  async function createNewUser(name, email, password, cb) {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      const uid = firestore.collection("users").doc().id;
      await firestore.collection("users").doc(uid).set({
        uid,
        name,
        email,
        chats: [],
        createdAt: new Date().toISOString(),
      });
      let globalColl = await getAllUsers();
      let allUsers = globalColl.data().users || [];
      setAllUsers(allUsers);
      await GLOBAL_REF.update({ users: [...allUsers, { uid, email }] });
      if (cb) cb();
    } catch (error) {
      if (cb) cb(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userDetails,
        pending,
        setPending,
        handleClickLogin,
        createNewUser,
        allUsers,
        setAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
