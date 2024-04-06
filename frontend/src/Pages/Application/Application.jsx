import React, { useContext, useState } from "react";
import "../../style/Application.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Context } from "../../main";
import axios from "axios";

const Application = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const { id } = useParams();

    const { authorised, user } = useContext(Context);

    const navigateTo = useNavigate();

    const handleApplication = async (e) => {
        e.preventDefault();
        let temp = new FormData();
        temp.append("name", name);
        temp.append("email", email);
        temp.append("coverLetter", coverLetter);
        temp.append("phone", phone);
        temp.append("address", address);
        try {
            const response = await axios.post(
                `http://localhost:4000/api/v1/application/post/${id}`,
                temp,
                {
                    withCredentials: true,
                    headers: {
                        "Content-type": "application/json",
                    }
                },
            );
            console.log(response);
            toast.success(response.data.message);
            navigateTo("/api/v1/student/jobs");
            setName("");
            setEmail("");
            setCoverLetter("");
            setPhone("");
            setAddress("");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div >
            <div className="application-container">
                <div className="application_title">Job Application Form</div>
                <div className="form-container" >
                    <form method="POST" action="">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Cover Letter"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button type="submit" onClick={(e) => handleApplication(e)}>
                            Apply
                        </button>

                    </form>
                </div>

            </div>

        </div>

    )
};
export default Application;