import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import "../style/adminSendNotification.css";
import "../style/common.css";
const AdminSendNotification = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const navigateTo = useNavigate();
    const handleSendNotification = async (e) => {
        e.preventDefault();
        let temp = new FormData();
        temp.append("title", title);
        temp.append("description", description);
        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/admin/send-general-notif",
                temp,
                {
                    withCredentials: true,
                    headers: {
                        "content-type": "application/json",
                    }
                }
            )
            toast.success(response.data.message);
            setTitle("");
            setDescription("");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <div className="notification-container">
                <div className="form-container">
                    <form method="POST">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button type="submit" onClick={(e) => handleSendNotification(e)}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AdminSendNotification;