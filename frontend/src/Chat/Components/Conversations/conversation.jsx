/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import "./conversation.css"
import axios from "axios";
import { Context } from "../../../main";


const Conversation = ({conversation, currentUser, isOpen}) => {
  const {typeUser} = useContext(Context); //this is the role of the logged in user
  // console.log(typeUser);
  const [user, setUser] = useState(null);
  let otherUser = null;
  if(typeUser === "student"){
    otherUser = "alumni";
  }
  else{
    otherUser = "student";
  }
  useEffect(() => {
    
    const userID = conversation.members.find((m) => m !== currentUser._id);
    // console.log(userID); //this is the id of other user in the conversation
    const getUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/${otherUser}/${userID}`);
        // console.log(res.data[otherUser]);
        setUser(res.data[otherUser]);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [currentUser, conversation]
  );
  return (
    <div className= {isOpen ? "conversation active" : "conversation"}>
        <img className="conversationImg" src= {otherUser === "student" ? user?.profilePhoto : user?.avatar} alt="" />
        <span className="conversationName">{otherUser === "student" ? user?.name : user?.username}</span>
    </div>
  )
}

export default Conversation