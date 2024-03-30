import React, { useState, useContext } from 'react';
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { Context } from "../../main";
import "../../style/PostJob.css";

const PostJob = () => {
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [jobType, setJobType] = useState("");
    const [deadline, setDeadline] = useState("");

    const { authorised, user } = useContext(Context);

    const navigateTo = useNavigate();

    const handlePostJob = async (e) => {

        e.preventDefault();
        let temp = new FormData();
        temp.append("category", category);
        temp.append("title", title);
        temp.append("description", description);
        temp.append("location", location);
        temp.append("salary", salary);
        temp.append("jobType", jobType);
        temp.append("deadline", deadline);

        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/job/post",
                temp,
                {
                    withCredentials: true,
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            );
            console.log(response);
            toast.success(response.data.messsage);
            navigateTo("/api/v1/company/dashboard");
            setCategory("");
            setTitle("");
            setDescription("");
            setLocation("");
            setSalary("");
            setJobType("");
            setDeadline("");
        } catch (error) {
            console.log(error);
            console.log(error.response);
            toast.error(error.response.data.message);
        }

    };

    return (
        <div>
            <div className="postjob-container">
                <div className="form-container" >
                    <form method="POST" action="">
                        <input
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
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
                        <input
                            type="text"
                            placeholder="Job Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Job Type"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                        />
                        <input
                            type="date"
                            placeholder="Deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                        <button type="submit" onClick={(e) => handlePostJob(e)}>
                            Post
                        </button>

                    </form>
                </div>

            </div>

        </div>
    )
};
export default PostJob;