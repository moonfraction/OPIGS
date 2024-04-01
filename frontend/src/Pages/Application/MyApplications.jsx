import React, { useState, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../../main";
import toast from 'react-hot-toast';
import '../../style/MyApplications.css';
import Application from './Application';
import axios from "axios";

const MyApplications = () => {
    const { user } = useContext(Context);
    const [applications, setApplications] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [resumeImageUrl, setResumeImageUrl] = useState("");
  
    const { authorised } = useContext(Context);
    const navigateTo = useNavigate();

    
  
    useEffect(() => {
      try {
        if (user && user.role === "Employer") {
          axios
            .get("http://localhost:4000/api/v1/application/employer/getall", {
              withCredentials: true,
            })
            .then((res) => {
              setApplications(res.data.companyApplications);
            });
        } else {
          axios
            .get("http://localhost:4000/api/v1/application/company", {
              withCredentials: true,
            })
            .then((res) => {
              setApplications(res.data.companyApplications);
            });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }, []);
  
    // if (!authorised) {
    //   navigateTo("/");
    // }
  
    const openModal = (imageUrl) => {
      setResumeImageUrl(imageUrl);
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };
  
    return (
      <section className="myapplicationspage">
          <div className="container">
            {applications.length <= 0 ? (
              <>
                <h4>No Applications Found</h4>
              </>
            ) : (
              applications.map((element) => {
                return (
                  <EmployerCard
                    element={element}
                    key={element._id}
                    openModal={openModal}
                  />
                );
              })
            )}
          </div>
        {modalOpen && (
          <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
        )}
      </section>
    );
  };
  
const EmployerCard = ({ element, openModal }) => {
  const handleAccept = async ()=>{
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/application/company/${element._id}/status`,{
          withCredentials:true,
          headers: {"Content-Type":"application/json"},
        }
      )
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
    return (
        <>
            <div className="jobseekercard">
                <div className="detail">
                    <p>
                        <span>Name:</span> {element.name}
                    </p>
                    <p>
                        <span>Email:</span> {element.email}
                    </p>
                    <p>
                        <span>Phone:</span> {element.phone}
                    </p>
                    <p>
                        <span>Address:</span> {element.address}
                    </p>
                    <p>
                        <span>CoverLetter:</span> {element.coverLetter}
                    </p>
                </div>
                <div className="resume">
                    <img
                        src={element.resume}
                        alt="resume"
                        onClick={() => openModal(element.resume)}
                    />
                   
                      <button className="approve" onClick={handleAccept}>Approve Application</button>
                </div>
            </div>
        </>
    );
};

const ResumeModal = ({ imageUrl, onClose }) => {
    return (
        <div className="resume-modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <img src={imageUrl} alt="resume" />
            </div>
        </div>
    );
};

export default MyApplications;