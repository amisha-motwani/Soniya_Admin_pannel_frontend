// // import { React, useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import {
// //   CButton,
// //   CCard,
// //   CCardBody,
// //   CCardGroup,
// //   CCol,
// //   CContainer,
// //   CForm,
// //   CFormInput,
// //   CInputGroup,
// //   CInputGroupText,
// //   CRow,
// // } from "@coreui/react";
// // import CIcon from "@coreui/icons-react";
// // import { useFormik } from "formik";
// // import { cilLockLocked, cilUser } from "@coreui/icons";
// // import { Schema } from "./Schema.js";
// // import { toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const initialValues = {
// //   username: "",
// //   password: "",
// //   secreteKey: "",
// // };

// // const Login = () => {
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();
// //   const [apiResponse, setApiResponse] = useState(null);
// //   const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
// //     useFormik({
// //       initialValues: initialValues,
// //       validationSchema: Schema,
// //       onSubmit: async (values) => {
// //         console.log("login is clicked");
// //         localStorage.setItem("secret_Key", values.secreteKey);
// //         sessionStorage.setItem("secreteKey", values.secreteKey);
// //         try {
// //           const userData = {
// //             email: values.username,
// //             password: values.password,
// //           };
// //           const response = await fetch(
// //             "http://localhost:5000/api/auth/loginUser",
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 "Secret-Key": values.secreteKey,
// //               },
// //               body: JSON.stringify(userData),
// //             }
// //           );

// //           if (response.status === 401) {
// //             console.log("Response 401==>", await response.json());
// //             const resp = await response.json();
// //             // toast.error(resp.error);
// //             toast.error("Invalid secret key");

// //             console.log("resp==>", resp?.error);
// //           } else if (response.status === 500) {
// //             console.log("Response 500==>");
// //             const resp = await response.text();
// //             console.log("resp==>", resp);
// //             toast.error(resp);
// //           } else if (!response.ok) {
// //             console.log(
// //               "Response Status:",
// //               response.status,
// //               await response.text()
// //             );
// //             throw new Error("Failed to log in");
// //           } else {
// //             const data = await response.json(); // Assuming the response is JSON
// //             console.log("Response from API:", data);
// //             const token = data.authToken;
// //             setApiResponse(data);
// //             localStorage.setItem("Token", token);
// //             navigate("/postData");
// //           }

// //           // if (!response.ok) {
// //           //   throw new Error("Failed to log in");
// //           //   console.log("secerete key", values.secreteKey );
// //           // }
// //           const data = await response.json(); // Assuming the response is JSON
// //           console.log("Response from API:", data);
// //           const token = data.authToken;
// //           setApiResponse(data);
// //           localStorage.setItem("Token", token);

// //           // navigate("/teamwork");
// //           navigate("/postData");
// //         } catch (error) {
// //           setError("Failed to log in. Please try again."); // Use setError to set the error state
// //           console.error("Login Error:", error);
// //         }
// //       },
// //     });

// //   console.log("response==>", apiResponse);
// //   console.log("Token==>", apiResponse?.authToken);

// //   const handleForgotPassword = () => {};

// //   return (
// //     <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
// //       <CContainer>
// //         <CRow className="justify-content-center">
// //           <CCol md={8}>
// //             <CCardGroup>
// //               <CCard className="p-4">
// //                 <CCardBody>
// //                   <CForm onSubmit={handleSubmit}>
// //                     <h1>Login</h1>
// //                     <p className="text-medium-emphasis">
// //                       Sign In to your account
// //                     </p>
// //                     <CInputGroup className="mb-3">
// //                       <CInputGroupText>
// //                         <CIcon icon={cilUser} className="text-white" />
// //                       </CInputGroupText>
// //                       <CFormInput
// //                         type="text"
// //                         name="username"
// //                         value={values.username}
// //                         onChange={handleChange}
// //                         placeholder="Enter your email"
// //                         autoComplete="username"
// //                         onBlur={handleBlur}
// //                       />
// //                       {errors.username && touched.username ? (
// //                         <p className="text-danger">{errors.username}</p>
// //                       ) : null}
// //                     </CInputGroup>
// //                     <CInputGroup className="mb-4">
// //                       <CInputGroupText>
// //                         <CIcon icon={cilLockLocked} className="text-white" />
// //                       </CInputGroupText>
// //                       <CFormInput
// //                         type="password"
// //                         name="password"
// //                         value={values.password}
// //                         onChange={handleChange}
// //                         placeholder="Enter your Password"
// //                         autoComplete="current-password"
// //                         onBlur={handleBlur}
// //                       />
// //                       {errors.password && touched.password ? (
// //                         <p className="text-danger">{errors.password}</p>
// //                       ) : null}
// //                     </CInputGroup>
// //                     <CInputGroup className="mb-4">
// //                       <CInputGroupText>
// //                         <CIcon icon={cilLockLocked} className="text-white" />
// //                       </CInputGroupText>
// //                       <CFormInput
// //                         type="text"
// //                         name="secreteKey"
// //                         value={values.secreteKey}
// //                         onChange={handleChange}
// //                         placeholder="Enter Secrete Key"
// //                         onBlur={handleBlur}
// //                       />
// //                       {errors.secreteKey && touched.secreteKey ? (
// //                         <p className="text-danger">{errors.secreteKey}</p>
// //                       ) : null}
// //                     </CInputGroup>
// //                     <CRow>
// //                       <CCol xs={6}>
// //                         <CButton
// //                           type="submit"
// //                           className="px-4 text-white bg-[#321fdb]"
// //                         >
// //                           Login
// //                         </CButton>
// //                       </CCol>
// //                       <CCol
// //                         xs={6}
// //                         className="text-right"
// //                         onClick={handleForgotPassword}
// //                       >
// //                         <CButton color="link" className="px-0">
// //                           Forgot password?
// //                         </CButton>
// //                       </CCol>
// //                     </CRow>
// //                   </CForm>
// //                 </CCardBody>
// //               </CCard>
// //               <CCard
// //                 className="text-white bg-primary py-5"
// //                 style={{ width: "44%" }}
// //               >
// //                 <CCardBody className="text-center">
// //                   <div>
// //                     <h2>Sign up</h2>
// //                     <p>
// //                       Lorem ipsum dolor sit amet, consectetur adipisicing elit,
// //                       sed do eiusmod tempor incididunt ut labore et dolore magna
// //                       aliqua.
// //                     </p>
// //                     <Link to="/register">
// //                       <CButton
// //                         color="primary"
// //                         className="mt-3"
// //                         active
// //                         tabIndex={-1}
// //                       >
// //                         Register Now!
// //                       </CButton>
// //                     </Link>
// //                   </div>
// //                 </CCardBody>
// //               </CCard>
// //             </CCardGroup>
// //           </CCol>
// //         </CRow>
// //       </CContainer>
// //     </div>
// //   );
// // };

// // export default Login;

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardGroup,
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
// import BusinessImage from "../../assets/images/BusinessImage.png";
// import BASE_URL from "src/API/Api";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [secreteKey, setSecreteKey] = useState("");
//   const [apiResponse, setApiResponse] = useState();

//   const handleLogin = async () => {
//     console.log("login is clicked");
//     localStorage.setItem("secret_Key", secreteKey);
//     sessionStorage.setItem("secreteKey", secreteKey);
//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/loginUser`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Secret-Key": secreteKey,
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       if (response.ok) {
//         // Successful login
//         console.log("Login successful");
//         const responseData = await response.json();
//         console.log("Response data:", responseData);
//         console.log("Token:", responseData.authToken);
//         localStorage.setItem("auth-token", responseData.authToken);
//         sessionStorage.setItem("auth-token", responseData.authToken);
//         toast.success("Login Successful");
//         navigate("/Add");
//       } else {
//         const errorData = await response.json();
//         console.error("Login failed:", errorData);
//         toast.error(errorData.error || errorData.errors[0].msg);
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       toast.error("An error occurred during login");
//     }
//   };
// const handleForget = () => [
//   navigate("/Forget")
// ]
//   return (
//     <div className="bg-[#e1e2e4] min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={8}>
//             <CCardGroup>
//               <CCard className="p-1">
//                 <CCardBody>
//                   <CForm>
//                     <h1 className="text-3xl text-center text-black">
//                       <b>Login</b>
//                     </h1>
//                     <p className="text-sky-800 py-3 mt-3">
//                       Sign In to your account
//                     </p>
//                     <CInputGroup className="mb-3">
//                       <CInputGroupText className="bg-gray-500 text-white">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="email"
//                         placeholder="Please enter your email"
//                         autoComplete="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CInputGroup className="mb-4">
//                       <CInputGroupText className="bg-gray-500 text-white">
//                         <CIcon icon={cilLockLocked}  />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="password"
//                         placeholder="Please enter your password"
//                         autoComplete="current-password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CInputGroup className="mb-4">
//                       <CInputGroupText className="bg-gray-500 text-white">
//                         <CIcon icon={cilLockLocked}/>
//                       </CInputGroupText>
//                       <CFormInput
//                         type="text"
//                         value={secreteKey}
//                         onChange={(e) => setSecreteKey(e.target.value)}
//                         placeholder="Enter Secrete Key"
//                       />
//                     </CInputGroup>
//                     <CRow>
//                       <CCol xs={12} className="flex justify-end mb-3 underline cursor-pointer text-sky-800 hover:text-sky-900 ">
//                         <h1 onClick={handleForget}>Forget password?</h1>
//                       </CCol>
//                     </CRow>
//                     <CRow>
//                       <CCol xs={12} className="flex justify-center">
//                         <CButton
                         
//                           className="px-4 bg-sky-800 hover:bg-sky-900 text-white py-[7px] mx-center border-none"
                         
//                           onClick={handleLogin}
//                         >
//                           Login
//                         </CButton>
//                       </CCol>
//                     </CRow>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//               <CCard
//                 className="text-white py-[2%] w-[44%] flex flex-col justify-between items-center "
//                 style={{
//                   backgroundImage: `url(${BusinessImage})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   backgroundRepeat: "no-repeat",
//                   width: "100%",
//                 }}
//               >
//                 <h2 className="text-3xl text-black text-center">
//                   <b>Sign up</b>
//                 </h2>

//                 <button
//                   onClick={() => navigate("/register")}
//                   className="mt-2 w-[fit-content] py-2 px-2 rounded bg-sky-800 hover:bg-sky-900 text-white "
//                 >
//                   Register Now!
//                 </button>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BusinessImage from "../../assets/images/BusinessImage.png";
import BASE_URL from "src/API/Api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secreteKey, setSecreteKey] = useState("");
  const [apiResponse, setApiResponse] = useState();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("login is clicked");
    localStorage.setItem("secret_Key", secreteKey);
    sessionStorage.setItem("secreteKey", secreteKey);
    setLoading(true); 
    try {
      const response = await fetch(`${BASE_URL}/api/auth/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Secret-Key": secreteKey,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // Successful login
        console.log("Login successful");
        const responseData = await response.json();
        console.log("Response data:", responseData);
        console.log("Token:", responseData.authToken);
        localStorage.setItem("auth-token", responseData.authToken);
        sessionStorage.setItem("auth-token", responseData.authToken);
        toast.success("Login Successful");
        navigate("/Add");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        toast.error(errorData.error || errorData.errors[0].msg);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleForget = () => {
    navigate("/Forget");
  };

  return (
   <>
     {loading? (
      <>
      <div className="flex justify-center items-center h-[100vh] w-[100%]">
      <CSpinner size="lg" className="my-auto mx-auto text-gray-400" />
      </div>
      </>
    ):(
      <>
       <div className="bg-[#e1e2e4] min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-1">
                <CCardBody>
                  <CForm>
                    <h1 className="text-3xl text-center text-black">
                      <b>Login</b>
                    </h1>
                    <p className="text-sky-800 py-3 mt-3">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText className="bg-gray-500 text-white">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Please enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText className="bg-gray-500 text-white">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Please enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText className="bg-gray-500 text-white">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        value={secreteKey}
                        onChange={(e) => setSecreteKey(e.target.value)}
                        placeholder="Enter Secrete Key"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol
                        xs={12}
                        className="flex justify-end mb-3 underline cursor-pointer text-sky-800 hover:text-sky-900"
                      >
                        <h1 onClick={handleForget}>Forget password?</h1>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs={12} className="flex justify-center">
                        <CButton
                          className="px-4 bg-sky-800 hover:bg-sky-900 text-white py-[7px] mx-center border-none"
                          onClick={handleLogin}
                          
                        >
                         
                            Login
                          
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white py-[2%] w-[44%] flex flex-col justify-between items-center"
                style={{
                  backgroundImage: `url(${BusinessImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  width: "100%",
                }}
              >
                <h2 className="text-3xl text-black text-center">
                  <b>Sign up</b>
                </h2>

                <button
                  onClick={() => navigate("/register")}
                  className="mt-2 w-[fit-content] py-2 px-2 rounded bg-sky-800 hover:bg-sky-900 text-white"
                >
                  Register Now!
                </button>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
      </>
    )}
   </>
   
  );
};

export default Login;
