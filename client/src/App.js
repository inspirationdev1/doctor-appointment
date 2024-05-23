import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import ApplyDoctor from "./pages/ApplyDoctor";
import Appointments from "./pages/Appointments";
import Notifications from "./pages/Notifications";
import DoctorsList from "./pages/Admin/DoctorsList";
import UsersList from "./pages/Admin/UsersList";
import Profile from "./pages/Doctor/Profile";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import BookAppointment from "./pages/BookAppointment";

import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}></Route>
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>}></Route>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
        <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>}></Route>
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>}></Route>
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>}></Route>
        <Route path="/admin/doctorslist" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>}></Route>
        <Route path="/admin/userslist" element={<ProtectedRoute><UsersList /></ProtectedRoute>}></Route>
        
        <Route path="/doctor/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
        <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>}></Route>
        
        <Route path="/book-appointment/:doctorId" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
