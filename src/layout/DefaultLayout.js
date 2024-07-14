import React from "react";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";
import 'bootstrap/dist/css/bootstrap.min.css';
// import gradientImage from '../gradientImage.jpeg'; 


const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100" 
      style={{background: " #FFFFFF"}}
      >
        <AppHeader />
        <div className="body flex-grow-1 p-0">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  );
};

export default DefaultLayout;
