import { createContext, useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { firebase } from "./firebase";
import styles from "./auth.module.scss";
import { v4 as uuid } from "uuid";

export const AuthContext = createContext();

function getUserObj(user, userId) {
  return {
    uid: userId,
    name: user?.displayName,
    email: user?.email,
    userImage: user?.photoURL,
    is_admin: false,
    assigned_forms: [],
  };
}

function getGlobalUser(user, userId) {
  return {
    uid: userId,
    name: user?.displayName,
    email: user?.email,
    userImage: user?.photoURL,
  };
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const db = firebase.firestore();

    const fetchUser = async (user) => {
      const userRef = db.collection("users").where("email", "==", user.email);
      const globalRef = db.collection("global");
      const snapshot = await userRef.get();
      const userData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      const globalUserSnapshot = await globalRef.doc("global").get();
      const globalData = globalUserSnapshot.data();
      let users = [];
      if (globalData?.users) {
        users = globalData?.users;
      }

      if (!userData[0]?.name) {
        const userCollectionRef = db.collection("users");
        const userId = `RU_${uuid().replace(/-/g, "_")}`;

        const userObj = getUserObj(user, userId);
        const globalUser = getGlobalUser(user, userId);
        users = [...users, globalUser];

        await userCollectionRef.doc(userId).set(userObj);
        await globalRef.doc("global").set({ ...globalData, users });
        setUserDetails(userObj);
        sessionStorage.setItem("uid", userObj?.uid);
        setPending(false);
      } else {
        setUserDetails(userData[0]);
        sessionStorage.setItem("uid", userData[0]?.uid);
        setPending(false);
      }
    };
    const checkUser = async () => {
      await firebase.auth().onAuthStateChanged((user) => {
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userDetails,
        setPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
