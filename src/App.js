// import React, { Component, Suspense } from "react";
// import { HashRouter, Route, Routes } from "react-router-dom";
// import "./scss/style.scss";
// import Testing from "./views/notifications/testing/Testing";
// import "./index.css";
// import {ToastContainer} from 'react-toastify';
// import Forget from "./views/pages/Forget";


// const loading = (
//   <div className="pt-3 text-center">
//     <div className="sk-spinner sk-spinner-pulse"></div>
//   </div>
// );

// // Containers
// const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// // Pages
// const SecondTry = React.lazy(() => import("./views/SecondTry"));
// const Login = React.lazy(() => import("./views/pages/Login"));
// const Register = React.lazy(() => import("./views/pages/Register"));

// class App extends Component {
//   render() {
//     return (
//   <>
//    <ToastContainer/>
//         <HashRouter>
//         <Suspense fallback={loading}>
//           <Routes>
//             <Route exact path="/" name="Login Page" element={<Login />} />
//             <Route
//               exact
//               path="/SecondTry"
//               name="Second Try"
//               element={<SecondTry />}
//             />
//             <Route
//               exact
//               path="/register"
//               name="Register Page"
//               element={<Register />}
//             />
//               <Route
//               exact
//               path="/forget"
//               name="Forget Page"
//               element={<Forget />}
//             />


//             <Route exact path="/Testing" name="Testing" element={<Testing />} />

//             <Route path="*" name="Home" element={<DefaultLayout />} />
//           </Routes>
//         </Suspense>
//       </HashRouter>
//   </>
//     );
//   }
// }

// export default App;



import React, { Suspense, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./scss/style.scss";
import Testing from "./views/notifications/testing/Testing";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import Forget from "./views/pages/Forget";
import BASE_URL from "./API/Api.js";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const SecondTry = React.lazy(() => import("./views/SecondTry"));
const Login = React.lazy(() => import("./views/pages/Login"));
const Register = React.lazy(() => import("./views/pages/Register"));

const App = () => {
  useEffect(() => {
    // Call the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/server`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text(); // Assuming the response is in text form
        console.log("Server Status:", data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
      // Set an interval to call fetchData every 5 minutes (300000 ms)
      const intervalId = setInterval(fetchData, 300000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
  }, []); 

  return (
    <>
      <ToastContainer />
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/" name="Login Page" element={<Login />} />
            <Route
              exact
              path="/SecondTry"
              name="Second Try"
              element={<SecondTry />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              element={<Register />}
            />
            <Route
              exact
              path="/forget"
              name="Forget Page"
              element={<Forget />}
            />
            <Route exact path="/Testing" name="Testing" element={<Testing />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
};

export default App;
