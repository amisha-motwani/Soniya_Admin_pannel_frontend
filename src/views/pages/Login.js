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
          <CCol lg={8} md={10} sm={11}>
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
                        <h1 className="text-[16px]" onClick={handleForget}>Forgot password?</h1>
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
                className="text-white py-[2%] w-[44%] flex flex-col justify-between items-center loginImage"
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
