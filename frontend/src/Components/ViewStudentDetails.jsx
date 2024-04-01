import React, { useEffect, useState } from "react";
import "../style/viewStudentDetails.css";
import axios from "axios";

const Resume = ({ user, close }) => {
  return (
    <div className="resume-container" id="resume-box">
      <div className="header">
        <h2>Resume</h2>
        <button
          className="close-button"
          onClick={() => {
            close(false);
          }}
        >
          X
        </button>
      </div>
      <div className="image">
        <img src={user.resume} alt="resume" />
      </div>
    </div>
  );
};

const StudentCard = ({ modal ,student, setClicked, setModal }) => {
  const handleCVModal = (e) => {
    if (student.resume === "") {
      toast.error("No CV uploaded yet");
    } else {
      setModal(true);
      setClicked(student);
    }
  };
  return (
    <div className={`student ${modal ? "modal-open" : ""}`}>
      <div className="details">
        <p>
          <span>Name : </span>
          {student.name}
        </p>
        <p>
          <span>Branch : </span>
          {student.branch}
        </p>
        <p>
          <span>CGPA : </span>
          {student.CGPA}
        </p>
      </div>
      <div className="resume">
        <button className="view-resume" onClick={handleCVModal}>
          View CV
        </button>
      </div>
    </div>
  );
};

const ViewStudentDetails = () => {
  const [modal, setModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [clicked, setClicked] = useState({});
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get(
        "http://localhost:4000/api/v1/student/getall"
      );
      setStudents(res.data.students);
    };
    fetchStudents();
  }, []);

  return (
    <div className={`view-student-container`}>
      {modal ? (
        <Resume className="resume" user={clicked} close={setModal} />
      ) : (
        ""
      )}
      {students.map((stu) => {
        return <StudentCard student={stu} setClicked={setClicked} setModal={setModal} modal = {modal}/>;
      })}
    </div>
  );
};

export default ViewStudentDetails;
