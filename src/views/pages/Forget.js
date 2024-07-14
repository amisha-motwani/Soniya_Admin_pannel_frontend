// import React from "react";
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
// } from "@coreui/react";
// import CIcon from "@coreui/icons-react";
// import { cilLockLocked, cilUser } from "@coreui/icons";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useFormik } from "formik";
// import { Schema } from "./Schema.js";  // Import the validation schema

// const Register = () => {
//   const { values, errors, touched, handleChange, handleSubmit, handleBlur } = useFormik({
//     initialValues: {
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema: Schema,
//     onSubmit: async (values, { setSubmitting, setErrors }) => {
//       try {
//         const response = await fetch("http://localhost:5000/api/auth/createUser", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: values.username,
//             email: values.email,
//             password: values.password,
//           }),
//         });

//         if (!response.ok) {
//           // Handle specific error cases based on status codes
//           if (response.status === 401) {
//             const errorText = await response.text();
//             console.log("401 Unauthorized:", errorText);
//             toast.error("Invalid secret key");
//           } else if (response.status === 400) {
//             const errorText = await response.text();
//             console.log("400 Bad Request:", errorText.error);
//             toast.error("Bad request. Please check your input.");
//           } else if (response.status === 500) {
//             const errorText = await response.text();
//             console.log("500 Internal Server Error:", errorText);
//             toast.error("Server error. Please try again later.");
//           } else {
//             throw new Error("Failed to log in");
//           }
//         } else {
//           // Handle successful response
//           const data = await response.json(); // Assuming the response is JSON
//           console.log("Successful response:", data);
//           const token = data.authToken;
//           localStorage.setItem("Token", token);
//           // Redirect or perform other actions upon successful login
//           // navigate("/postData");
//         }
//       } catch (error) {
//         console.error("Network Error:", error.message);
//         toast.error("Network error. Please try again later.");
//         setErrors({ submit: "Network error. Please try again later." });
//       } finally {
//         setSubmitting(false);
//       }
//     },

//   });

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={9} lg={7} xl={6}>
//             <CCard className="mx-4">
//               <CCardBody className="p-4">
//                 <CForm onSubmit={handleSubmit}>
//                   <h1>Register</h1>
//                   <p className="text-medium-emphasis">Create your account</p>
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText className="text-white">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput
//                       name="username"
//                       type="text"
//                       placeholder="Username"
//                       autoComplete="username"
//                       value={values.username}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       invalid={touched.username && !!errors.username}
//                     />
//                     {touched.username && errors.username && (
//                       <div className="invalid-feedback d-block">{errors.username}</div>
//                     )}
//                   </CInputGroup>
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText className="text-white">@</CInputGroupText>
//                     <CFormInput
//                       name="email"
//                       type="email"
//                       placeholder="Email"
//                       autoComplete="email"
//                       value={values.email}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       invalid={touched.email && !!errors.email}
//                     />
//                     {touched.email && errors.email && (
//                       <div className="invalid-feedback d-block">{errors.email}</div>
//                     )}
//                   </CInputGroup>
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText className="text-white">
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       name="password"
//                       type="password"
//                       placeholder="Password"
//                       autoComplete="new-password"
//                       value={values.password}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       invalid={touched.password && !!errors.password}
//                     />
//                     {touched.password && errors.password && (
//                       <div className="invalid-feedback d-block">{errors.password}</div>
//                     )}
//                   </CInputGroup>
//                   <CInputGroup className="mb-4">
//                     <CInputGroupText className="text-white">
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       name="confirmPassword"
//                       type="password"
//                       placeholder="Repeat password"
//                       autoComplete="new-password"
//                       value={values.confirmPassword}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       invalid={touched.confirmPassword && !!errors.confirmPassword}
//                     />
//                     {touched.confirmPassword && errors.confirmPassword && (
//                       <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
//                     )}
//                   </CInputGroup>
//                   {errors.submit && (
//                     <div className="text-danger mb-3">{errors.submit}</div>
//                   )}
//                   <div className="d-grid">
//                     <CButton type="submit" color="success">
//                       Create Account
//                     </CButton>
//                   </div>
//                 </CForm>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormLabel,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BASE_URL from "src/API/Api";

const Forget = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("msg-->", responseData.message);
        toast.success(responseData.message);
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Reset failed:", errorData);
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Error resetting");
    } finally {
      setLoading(false);
    }
  };
  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] w-[100%]">
          <CSpinner size="lg" className="my-auto mx-auto text-gray-400" />
        </div>
      ) : (
        <>
          <div className="bg-[#e1e2e4] min-vh-100 d-flex flex-row align-items-center">
            <CContainer className="">
              <button
                onClick={handleBackClick}
                className="  bg-sky-800 hover:bg-sky-900 text-white lg:ms-5 md:ms-4 ms-1 lg:my-1 my-3 w-[fit-content] h-[fit-content] py-0 px-3 rounded-md"
              >
                <FontAwesomeIcon className="text-white" icon={faArrowLeft} />
              </button>
              <CRow className="justify-content-center ">
                <CCol lg={6} md={8} className="">
                  <CCard className="mx-4 bg-white text-black rounded-xl ">
                    <CCardBody className="p-4">
                      <CForm>
                        <h1 className="text-center text-xl my-4">
                          <b>Reset Password</b>
                        </h1>

                        <CInputGroup className="mb-3">
                          <div className="flex items-center sm:w-[20%] w-[90%]">
                            <CFormLabel>Enter email:</CFormLabel>
                          </div>
                          <div className="flex gap-2 sm:w-[80%] w-[100%]">
                            <CInputGroupText className="bg-gray-500 text-white h-[36px]">
                              @
                            </CInputGroupText>
                            <CFormInput
                              className="h-[36px]"
                              placeholder="Enter Email here"
                              autoComplete="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </CInputGroup>

                        <div className="flex justify-center ">
                          <CButton
                            onClick={handleReset}
                            className="w-[fit-content] py-2 bg-sky-800 hover:bg-sky-900 text-white transition duration-300 border-none"
                          >
                            Reset
                          </CButton>
                        </div>
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CContainer>
          </div>
        </>
      )}
    </>
  );
};

export default Forget;
