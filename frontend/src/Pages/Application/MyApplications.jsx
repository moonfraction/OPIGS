import React,{useState,useContext} from 'react';
import {Context} from "../../main";
import toast from 'react-hot-toast';
import '../../style/MyApplication.css';
const MyApplication= ()=>{
    const {user,authorised}=useContext(Context);
    const [applications,setApplications]=useState([]);
    useEffect(()=>{
        try{
            axios.get("http://localhost:4000/api/v1/application/company",{
                withCredentials:true,
            })
        }
        catch(error){

        }
    })
    
    return(
        <div>

        </div>
    )
}
export default MyApplication;