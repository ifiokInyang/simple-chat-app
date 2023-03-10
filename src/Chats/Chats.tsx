import { IMessage } from '@/Utils/Interface/Interface.dto';
import React, { ChangeEvent, useState, useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

const Chats = ({socket, username, room}) => {
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageList, setMessageList] = useState<IMessage[]>([])



    const handleChat = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setCurrentMessage((previous) => previous = value)
      }

      const sendMessage = async () => {
            if (currentMessage !== ""){
                const messageData = {
                    room: room,
                    sender: username,
                    message: currentMessage,
                    time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`
                };

                await socket.emit("send_message", messageData)
                setMessageList((list: any[]) => [...list, messageData])
                setCurrentMessage("")

            };
      }
    

      useEffect (() =>{
          return () => {
        socket.on("receive_message", (data: string) => {
                setMessageList((list: any[]) => [...list, data])
                console.log("message is ", data)
            
            
        })
    }
      }, [socket]);
  return (
    <div className='chat-window'>
        <div className='chat-header'>
            <p>Live Chat</p>
        </div>
        <div className='chat-body'>
            <ScrollToBottom className='message-container'>
            {messageList.map((message: IMessage, index) => (
                <div key={index} className="message"
                id={username === message.sender ? "you" : "other"}>
                    <div>
                        <div className='message-content'>
                            <p>
                                {message.message}
                            </p>
                        </div>
                        <div className='message-meta'>
                        <p id="time">
                                {message.time}
                            </p>
                            <p id="author">
                                {message.sender}
                            </p>
                        </div>

                    </div>
                    <h1> {message.message} </h1>
                </div>
            ))}

        </ScrollToBottom>
        </div>

        <div className='chat-footer'>
            <input type="text" 
            placeholder='type your chat..'
            value={currentMessage}
            onChange={handleChat} 
            onKeyDown={((event: React.KeyboardEvent<HTMLInputElement>) =>{
                if (event.key === "Enter"){
                    sendMessage()
                    setCurrentMessage("")
                }
            } )}
            />
            <button onClick={sendMessage}>&#9658;</button>
        </div>

    </div>
  )
}

export default Chats;
