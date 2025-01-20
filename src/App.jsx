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

          {/* ADMIN */}
          <Route path="/report/list" element={<ReportList />} exact="true" />
          <Route
            path="/announcement"
            element={<AnnouncementPage />}
            exact="true"
          />
          <Route path="/dashboard" element={<Dashboard />} exact="true" />
          <Route
            path="/single/report/:id"
            element={<ViewReport />}
            exact="true"
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
