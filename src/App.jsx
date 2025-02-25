import Header from "./Components/Layout/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Components/User/Profile";
import Home from "./Components/Home";
import ReportList from "./Components/Admin/Reports/ReportList";
import AnnouncementPage from "./Components/Home/Announcement";
import Login from "./Components/User/Login";
import Dashboard from "./Components/Admin/Dashboard";
import FYP from "./Components/Home/FYP";
import ViewReport from "./Components/Admin/Reports/ViewReport";
import ViewObstruction from "./Components/Admin/Reports/ViewObstructions";
import AnnouncementDetails from "./Components/Home/AnnouncementDetails";
import Register from "./Components/User/Register";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewPlateNumber from "./Components/Admin/Reports/ViewPlateNumber";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/FYP" element={<FYP />} exact="true" />
          <Route path="/profile" element={<Profile />} exact="true" />

          {/* USER */}
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route
            path="/announcement/:id"
            element={<AnnouncementDetails />}
            exact="true"
          />
          <Route
            path="/announcement"
            element={<AnnouncementPage />}
            exact="true"
          />

          {/* ADMIN */}
          <Route path="/report/list" element={<ReportList />} exact="true" />
          <Route path="/dashboard" element={<Dashboard />} exact="true" />
          <Route
            path="/single/report/:id"
            element={<ViewReport />}
            exact="true"
          />
          <Route
            path="/single/obstruction/:id"
            element={<ViewObstruction />}
            exact="true"
          />
          <Route path="/single/plate/:id" element={<ViewPlateNumber/>} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          limit={6}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </Router>
    </>
  );
}

export default App;
