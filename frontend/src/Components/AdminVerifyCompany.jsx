import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import "../style/AdminVerifyCompany.css";

const RequestCard =({ele})=>{
    const [name,setName]=useState("");
    const [email,setEmail] = useState("");
    const [website,setWebsite] = useState("");
    useEffect(()=>{
        const fetchCompany = async () =>{
            try{
                const response = await axios.get(
                    `http://localhost:4000/api/v1/company/${ele.company}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                )
                setName(response.data.company.name);
                setEmail(response.data.company.email);
                setWebsite(response.data.compnay.website);
            }catch(error){
                console.log(error);
            }
        }
        fetchCompany();
    },[])
    const handleAccept = async () =>{
        const [stats,setStats]=useState("approved");
        try {
            const response = await axios.put(`http://localhost:4000/api/v1/admin/verify/${ele._id}`,
            {stats},
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            })        
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    const handleReject = async () =>{
        const [stats,setStats]=useState("rejected");
        try {
            const response = await axios.put(`http://localhost:4000/api/v1/admin/verify/${ele._id}`,
            {stats},
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            })        
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return(
        <div className="request-card">
            <div className="left">
                <p>{name}</p>
                <p>{email}</p>
                <p>{website}</p>
            </div>
            <div className="right">
                <button className="aceept" onClick={handleAccept}>Accept</button>
                <button className="reject" onClick={handleReject}>Reject</button>
            </div>
        </div>
    )
}
const AdminVerifyCompany = ()=>{
    const [requests,setRequests] = useState([]);
    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const response = await axios.get(
              "http://localhost:4000/api/v1/admin/all-requests",
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            setRequests(response.data.requests);
          } catch (error) {
            toast.error(error.response.data.message);
          }
        };
        fetchRequests();
      });

    return(
        <div className="view-request-container">
            { requests && 
                requests.map((element)=>{
                    return <RequestCard ele ={element}/>
                })
            }
        </div>
    )
}
export default AdminVerifyCompany;