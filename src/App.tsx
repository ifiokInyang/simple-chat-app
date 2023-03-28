import React, { ChangeEvent, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chats from "./Chats/Chats";

const ServerUrl = process.env.REACT_APP_SERVER_URL;

const socket = io(`${ServerUrl}`);

function App() {
  const [userName, setUserName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [newUser, setNewUser] = useState("");

  const handleRoomId = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setRoom((previous) => (previous = value));
  };
  const handleJoinChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    if (value !== userName) {
      setUserName((previous) => (previous = value));
      setNewUser(value);
    } else {
      setUserName((previous) => (previous = value));
    }
  };
  const joinRoom = () => {
    console.log("username is ", userName);
    // setNewUser(userName)
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <>
      <div className="App">
        {!showChat ? (
          <div className="joinChatContainer">
            <h3>Join a chat</h3>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              placeholder="Join..."
              onChange={handleJoinChange}
              value={userName}
            />
            <label htmlFor="name">Room Name</label>
            <input
              type="text"
              placeholder="Room Id..."
              onChange={handleRoomId}
              value={room}
            />
            <button onClick={joinRoom}>Join a Chat Room</button>
          </div>
        ) : (
          <Chats
            socket={socket}
            newUser={newUser}
            username={userName}
            room={room}
          />
        )}
      </div>
    </>
  );
}

export default App;
