import React, { useState, useEffect } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import { useFormik } from 'formik';
import { signUpSchema } from '../schemas/Helper';
import './Edit.css';

import {AiOutlineCloseCircle} from 'react-icons/ai'

import { routes } from '../Utils/Globals'



export default function EditClients() {
  var uId = "";
  const navigate = useNavigate();
  let { vcliID } = useParams();
  let token = localStorage.getItem("tokena");
  let ntoken = "Bearer " + token.replaceAll('"', '');
  const [det, setDet] = useState({});
  const [editShow,setEditShow] = useState(false);
  const [showSuccessMsg,setShowSuccessMsg] = useState(false);
  const [dispMsg,setDispMsg] = useState("");
  const [showErrorsMsg,setShowErrorMsg] = useState(false);
  const successBg = 'alert alert-success alert-dismissible fade show';
  const warningBg = 'alert alert-warning alert-dismissible fade show';


  function myFuncCall (){
  //  navigate(`/editclient/${det.userID}`);
  navigate('.', { replace: true });
  setShowSuccessMsg(false); 
    // window.location = `/editclient/${det.userID}`;
  }
  const clientProfileData = async () => {
    let token = localStorage.getItem("tokena");
    let ntoken = "Bearer " + token.replaceAll('"', '');



    await fetch(`${routes.getSpecificClient}/${vcliID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
        "Authorization": ntoken,
        "Access-Control-Max-Age": 86400
      }
    })
      .then(async res => await res.json())
      .then((data) => {
        localStorage.setItem("uid", data.userID);
        // localStorage.setItem("advName", data.sortName);
        setDet(data);
        uId = data.userID;
        console.log(data);
        setInitialValues(data);
        // Formik.values(data);

        // console.log("Mydata->", det);
        // console.log("Mydata2->", initialValues);
        // setFlag("true");
        // console.log(flag);
      })
  }

  let depen = "nochange";
  useEffect(() => {
    clientProfileData();
  }, [depen])
  // const [firstName, setFirstName] = useState("");
  const [initialValues,setInitialValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    address: "",
    state: "",
    city: "",
  });
  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUpSchema,
    enableReinitialize:true,
    onSubmit: (values,action) => {
      try {
        console.log("Call maked!");
        console.log(values);
        uId = localStorage.getItem("uid");
        fetch(`${routes.updateClient}/${uId}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
            "Authorization": ntoken,
            "Access-Control-Max-Age": 86400
          },
          body: JSON.stringify(values)

        })
          .then(res => {
            // res.json()
            if (res.status === 200){
              // alert("Profile updated successfully.")

              setDispMsg("Profile updated successfully!")
              // setDet(res.body)
              // console.log(res);
              setShowSuccessMsg(true);
              setEditShow(false);
              setTimeout(myFuncCall, 1000);
              console.log(`/editclient/${det.userID}`);
              return res.json();
              // return res;
              // return res.body;
              
              // navigate(`/editclient/${det.userID}`);
              // window.location = `/editclient/${det.userID}`;
            }
            else{
              // alert("Something went wrong, try again.")
              setDispMsg("Something went wrong, try again!")
              setShowSuccessMsg(true);
              setShowErrorMsg(true);
              return "error";
            }
            
          })
          .then((data) =>{
            console.log("Yo");
            console.log(data);
            if (data != "error"){
              setDet(data);
              setInitialValues(data);
            }
            // alert(data);
            // window.location ='/login'
          })
          .catch((error) => {
            
            console.log("Error occurred:", error);

            if (error == "TypeError: Load failed" || error == "TypeError: Failed to fetch") {
              setShowErrorMsg(true);
              setShowSuccessMsg(true);
              setDispMsg("Server is Facing some issue. Please check Again Later!");
            }
            // setIsLoading(false);
            // Handle the error here
          });
      } catch (error) {
        console.log("Error b->", error);
      }
      action.resetForm();
    }
  })
  return (
    <>
      <div className='mt-4'>

        <div style={{marginRight:"20px"}}>
          <form onSubmit={Formik.handleSubmit}>
            <div className='row p-2'>
            {showSuccessMsg && <div className='p-4 tex-center'>
            <div className={(showErrorsMsg ? warningBg : successBg)} style={{width:"auto"}} role="alert">
            {showErrorsMsg ? <i class="bi bi-exclamation-circle"></i> : <i className="bi bi-check-circle mt-1"></i>} &nbsp;
              <strong></strong> {dispMsg}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={(e)=> {setShowSuccessMsg(false);}}></button>
            </div>
          </div> 
           }
            <div className='col-5'>
   
              <h5 className='mt-5'>Personal Details</h5>
    <p className='font-weight-bold mt-2'>ClientID: {det.clientID}</p>
    </div>
    
    <div className='col-5'>
              <h3 className=''>Client Profile</h3>
    </div>
    <div className='col-2 mb-2'>

      <button className='float-right mt-5 btn btn-primary' type='button' onClick={(e)=>{setEditShow(true)}}>Edit</button>    
    </div>
    <hr />
    <div className='col-4 mt-2'><label className='bol'><b>SortName: &nbsp;{det.sortName}</b> </label></div>
    <div className='col-4'><label>Email: &nbsp;{det.email} </label></div>
    <div className='col-4'><label>Phone: &nbsp;{det.phone} </label></div>
    <div className='col-4 mt-2'><label>Address: &nbsp;{det.address} </label></div>
    <div className='col-4'><label>State: &nbsp;{det.state} </label></div>
    <div className='col-4'><label>City: &nbsp;{det.city} </label></div>
    <div className='col-4 mt-2'><label>Company: &nbsp;{det.company} </label></div>
    <div className='p-2 mt-2'>
      <hr />
      {editShow && <AiOutlineCloseCircle size={25} className="" style={{float:"right"}} onClick={(e)=>{setEditShow(false)}} />}
      </div>
              {/* <h5>AdvisorID:&nbsp;{det.advisorID}</h5> */}
              {/* <h6 style={{fontWeight:"300!important"}}>AdvisorID:&nbsp;{det.advisorID}</h6> */}
              {/* <hr /> */}
              {/* </div> */}
              {/* <div className='row'> */}
              {editShow ?
              (
                <>
                
                <div className='col-4'>
                <p>FirstName</p>
                <input type="text" name="firstName" placeholder='First Name' className='form-control shadow-none my-3' value={Formik.values.firstName} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.firstName && Formik.touched.firstName ? (<p className='Form-error'> {Formik.errors.firstName}</p>) : null}
              </div>
              <div className='col-4'>
                <p>LastName</p>
                <input type="text" name="lastName" placeholder='Last Name' className='form-control shadow-none my-3' value={Formik.values.lastName} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.lastName && Formik.touched.lastName ? (<p className='Form-error'> {Formik.errors.lastName}</p>) : null}

              </div>
              
              <div className='col-4'>
                
                <p>Phone</p>
                <input type="text" name="phone" placeholder='Phone No' className='form-control shadow-none my-3' value={Formik.values.phone} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.phone && Formik.touched.phone ? (<p className='Form-error'> {Formik.errors.phone}</p>) : null}
              </div>
              <div className='col-4'>
                <p>Email</p>
                <input type="email" name="email" placeholder='Email' className='form-control shadow-none my-3' value={Formik.values.email} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.email && Formik.touched.email ? (<p className='Form-error'> {Formik.errors.email}</p>) : null}
              </div>
              <div className='col-4'>
                <p>Company</p>
                <input type="name" name="company" placeholder='Company' className='form-control shadow-none my-3' value={Formik.values.company} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.company && Formik.touched.company ? (<p className='Form-error'> {Formik.errors.company}</p>) : null}
              </div>
              <div className='col-4'>
                <p>Address</p>
                <input type="name" name="address" placeholder='Address' className='form-control shadow-none my-3' value={Formik.values.address} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.address && Formik.touched.address ? (<p className='Form-error'> {Formik.errors.address}</p>) : null}
              </div>
              <div className='col-4'>
                <p>State</p>
                <input type="name" name="state" placeholder='State' className='form-control shadow-none my-3' value={Formik.values.state} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.state && Formik.touched.state ? (<p className='Form-error'> {Formik.errors.state}</p>) : null}
              </div>
              <div className='col-4'>
                <p>City</p>
                <input type="name" name="city" placeholder='City' className='form-control shadow-none my-3' value={Formik.values.city} onChange={Formik.handleChange} onBlur={Formik.handleBlur}></input>
                {Formik.errors.city && Formik.touched.city ? (<p className='Form-error'> {Formik.errors.city}</p>) : null}
              </div>

              <div className='col-2 mt-2'>
                <br></br>

                <button className='btn btn-primary' type='submit'> Update

                  {/* <MdOutlinePublishedWithChanges size={20} /> Update */}
                </button>
              </div>
              {/* <br></br> */}
              {/* <hr /> */}
              </>
              ) : ""}
              
              


            </div>
          </form>

        </div>
      </div>
    </>
  )
}
