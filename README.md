## P2P Chat App - Fullstack Externship | Dive | Github Externship

P2P is a (Peer to Peer) / (Person to Person) live chat application like WhatsApp or any other chat application in the market for the web, where users can send direct messages to each other via the internet.

These messages acknowledge the end user on being sent, delivered and read. The communication between two clients is facilitated through Firebase’s real time database which is a software / backend as a service.

### DB Architecture

How the data is stored on firebase using both firestore and realtime database.

#### Firestore

**User**

```typescript
{
    uid: string, // same as firebase auth uid
    name: string,
    email: string,
    chats: [
        {
            name: string,
            uid: string,
            roomId: string,
        }
    ],
    createdAt: Date,
}
```

**Global** <br />
Used for retreiving all users at once from database.

```typescript
{
  users: [{ email: string, name: string, uid: string }];
}
```

#### Realtime Database

**Messages**

```typescript
{
    roomId: {
        messageId: {
            author: string, // author's UID
            createdAt:  Date,
            id: string, // same as messageId
            isDelivered: Boolean,
            isRead: Boolean,
            isSent: Boolean,
            message: string, // message body
            recipient: string, // Recipients UID
            recipientName: string,
            roomId: string,
        }
    }
}
```

What is roomId? <br />
When two users try to communicate with each other, their messaging connection is setup through a common room for simplicity. All their messages travel through and get stored in that room on firebase realtime database.

**Status** <br />
Used to check if the user is online or offline.

```typescript
{
    uid: {
        last_changed: Date,
        state: string, // offline | online
        uid: string,
    }
}
```

### What does the application lack right now?

- As of now, there is no notification functionality, it'd be nice to have a little popup or some sound when someone sends a message.
- No security <br />
  Application is not very secure right now, backend transactions are secure because of firebase but other things like the message itself is not, anyone who owns the database can direclty read it. We can implement encryption to add more securiy.
- Not optimized <br />
  Due to strict deadlines, it was certainly not possibly to cover all the corner cases due to which the application might not be as smooth as it could have been. It may not be able to handle a lot of users simultaneously, or may not be able to handle unknown errors.
