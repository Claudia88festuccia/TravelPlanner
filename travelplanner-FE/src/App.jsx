import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navbar";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Footer from "./components/Footer";
import { LoadScript } from "@react-google-maps/api";

function App() {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </>
    </LoadScript>
  );
}

export default App;


