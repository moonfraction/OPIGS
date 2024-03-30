import "./message.css"
import {format} from "timeago.js"

const message = ({message, own}) => {
    return (
        <div className= {own? "message own " : "message"}>
            <div className="messageTop">
                {
                    own ? 
                    <>
                    <p className="messageText">{message.text}</p>
                    <img className="messageImg" src="" alt="Avatar" /> 
                    </>
                    :
                    <>
                    <img className="messageImg" src="" alt="Avatar"/>
                    <p className="messageText">{message.text}</p>
                    </>
                }
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}

export default message