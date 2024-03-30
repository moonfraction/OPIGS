import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import '../style/viewRequestAlumni.css';

const RequestCard = () => {
    return (
        <div className="request-card">
            <div className="left"></div>
            <div className="right"></div>
        </div>
    )
}

const ViewRequestAlumni = () => {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/v1/alumni/requests", {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                setRequests(response.data.requests);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        fetchRequests();
    },[])
  return (
    <div className='view-request-container'>
      
    </div>
  )
}

export default ViewRequestAlumni
