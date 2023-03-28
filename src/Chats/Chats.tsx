import { IMessage } from "@/Utils/Interface/Interface.dto";
import React, { ChangeEvent, useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chats = ({ socket, username, room, newUser }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<IMessage[]>([]);

  const handleChat = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setCurrentMessage((previous) => (previous = value));
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        message: currentMessage,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list: any[]) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: string) => {
      setMessageList((list: any[]) => [...list, data]);
    });
  }, [socket]);
  return (
    <div className="chat-window">
      <h3 style={{ textAlign: "center" }}>
        {username} you are chatting live in room {room}
      </h3>
      <p style={{ textAlign: "center" }}>
        Invite your friends to join your chat with Room Id: {room}
      </p>
      <p style={{ textAlign: "center" }}>Have fun 🕺💃🏽🎉</p>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((message: IMessage, index) => (
            <div
              key={index}
              className="message"
              id={username === message.sender ? "other" : "you"}
            >
              <div>
                <div className="message-content">
                  <p>{message.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{message.time}</p>
                  <p id="author">{message.sender}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="type your chat.."
          value={currentMessage}
          onChange={handleChat}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              sendMessage();
              setCurrentMessage("");
            }
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chats;
