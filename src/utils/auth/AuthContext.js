import { createContext, useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { auth, firebase, firestore } from "./firebase";
import styles from "./auth.module.scss";

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
      setPending(false);
    };
    const checkUser = () => {
      firebase.auth().onAuthStateChanged((user) => {
        setCurrentUser(user);
        if (user && user?.email?.length) fetchUser(user);
        else setPending(false);
      });
    };
    checkUser();
  }, []);

  useEffect(() => {
    let isOfflineForDatabase = {
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
      uid: currentUser?.uid,
    };

    let isOnlineForDatabase = {
      state: "online",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
      uid: currentUser?.uid,
    };

    if (currentUser?.uid) {
      const STATUS_DB_REF = firebase
        .database()
        .ref("/status/" + currentUser.uid);
      firebase
        .database()
        .ref(".info/connected")
        .on("value", function (snapshot) {
          // If we're not currently connected, don't do anything.
          // eslint-disable-next-line eqeqeq
          if (snapshot.val() == false) {
            return;
          }

          STATUS_DB_REF.onDisconnect()
            .set(isOfflineForDatabase)
            .then(function () {
              STATUS_DB_REF.set(isOnlineForDatabase);
            });
        });
    }
  }, [currentUser]);

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
      let userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;
      await firestore.collection("users").doc(uid).set({
        uid,
        name,
        email,
        chats: [],
        createdAt: new Date().toISOString(),
      });
      let globalColl = await getAllUsers();
      let allUsers = globalColl.data()?.users || [];
      setAllUsers(allUsers);
      await GLOBAL_REF.update({ users: [...allUsers, { uid, email, name }] });
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
