import React,{useContext,useState} from "react";
import "../../style/Application.css";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Context} from "../../main";
import "../../style/Application.css";

const Application =() =>{
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [coverLetter,setCoverLetter] = useState("");
    const [phone,setPhone] = useState("");
    const [address,setAddress] = useState("");

    const {authorised,user} = useContext(Context);

    const navigateTo = useNavigate();
    
    const handleApplication = async(e)=>{
        e.preventDefault();
        let temp = new FormData();
        temp.append("name",name);
        temp.append("email",email);
        temp.append("coverLetter",coverLetter);
        temp.append("phone",phone);
        temp.append("address",address);
        try {
            const resp  = await axios.post(
                "http://localhost:4000/api/v1/application/post",
                temp,
                {
                    withCredentials : true,
                    headers:{
                        "Content-type":"application/json",
                    }
                },
            );
            toast.success(resp.data.message);
            setName("");
            setEmail("");
            setCoverLetter("");
            setPhone("");
            setAddress("");
            navigateTo("/api/v1/student/jobs/getall");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

 return(
    <div className ="application-body">
        <div className="application-container">
        <div className="form-container" > 
        <form method ="POST" action = "/api/v1/student/postApplication/:id">
        <input
        type="text"
        placeholder = "Name"
        value={name}
        onChange = {(e)=>setName(e.target.value)}
        />
        <input
        type="text"
        placeholder = "Email"
        value={email}
        onChange = {(e)=>setName(e.target.value)}
        />
        <input
        type="text"
        placeholder = "Cover Letter"
        value={coverLetter}
        onChange = {(e)=>setName(e.target.value)}
        />
        <input
        type="tel"
        placeholder = "Phone Number"
        value={phone}
        onChange = {(e)=>setName(e.target.value)}
        />
        <input
        type="text"
        placeholder = "Address"
        value={address}
        onChange = {(e)=>setName(e.target.value)}
        />

        <button type="submit" onClick = {(e)=>handleApplication(e)}>
            Apply
        </button>

    </form>
    </div>
    
    </div>
    
    </div>
    
 )
 };
export default Application;