export const getUserData = (allUsers, uid) => {
  return allUsers?.find((user) => user.uid === uid);
};

export const creatRoom = (uids) => {
  return uids
    .map((id) => id.slice(0, 5))
    .sort()
    .join("");
};

export const getRoomId = (email, chats) => {
  return chats?.find((chat) => chat.email === email);
};

export const getStatus = (onlinePeople, uid) => {
  let idx = onlinePeople?.findIndex((user) => user.uid === uid);
  console.log({ idx });
  return idx > -1 ? onlinePeople[idx].state : "offline";
};
