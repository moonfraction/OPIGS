/* eslint-disable react/jsx-key */
import { useContext, useEffect, useState } from "react";
import Conversation from "./Components/Conversations/conversation"
import Message from "./Components/message/message"
import "./chat.css"
import { Context } from "../main";
import axios from "axios";

const Chat = () => {

  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { user } = useContext(Context);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/conversations/${user._id}`);
        // console.log(res.data);
        setConversation(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getConversation();
  }, [user._id]);


  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post("http://localhost:4000/api/v1/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="messanger">
        <div className="chatBox">
          {currentChat ?
            <>
              <div className="chatBoxWrapper">
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div key={m._id}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea className="chatMessageInput" placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                </div>
              </div>
            </> : <span className="noConversationText">Open a conversation to start a chat.</span>
          }
        </div>
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for Alumni" className="chatMenuInput" />
            <div className="conversationList">
              {conversation.map((c) => (
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} key={c._id} currentUser={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat