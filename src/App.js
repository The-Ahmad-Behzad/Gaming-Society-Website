import './App.css';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Signup from './pages/Signup';
import Home from './pages/Home';
import NavbarHook from "./components/NavbarHook"
import RegisterForEvent from "./pages/RegisterForEvent"
import RegisterEvent from "./pages/RegisterEvent"
import GalleryPage from './pages/GalleryPage';
import BecomeMember from './pages/BecomeMember';
import ApproveEvent from './pages/ApproveEvent';
import ApproveMember from './pages/ApproveMember';
import ViewParticipants from './pages/ViewParticipants';
import AssignTaskToTeam from './pages/AssignTaskToTeam';
import ReportIssueOrQuery from './pages/ReportIssueOrQuery'
import ViewIssues from './pages/ViewIssues';
import AssignTaskToMember from './pages/AssignTaskToMember';
import PageNotFound from './pages/PageNotFound';
import BackgroundVideo from './components/BackgroundVideo';

function App() {
  return (
  <div style={{paddingTop: "3rem"}}>
    <Router>
          <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register-for-event" element={<RegisterForEvent />} />
          <Route path="/register-event" element={<RegisterEvent />} />
          <Route path="/gallery-page" element={<GalleryPage />} />
          <Route path="/become-member" element={<BecomeMember />} />
          <Route path="/approve-event" element={<ApproveEvent />} />
          <Route path="/approve-member" element={<ApproveMember />} />
          <Route path="/view-participants" element={<ViewParticipants />} />
          <Route path="/view-issues" element={<ViewIssues />} />
          <Route path="/assign-task-to-team" element={<AssignTaskToTeam />} />
          <Route path="/assign-task-to-member" element={<AssignTaskToMember />} />
          <Route path="/report-issue-or-query" element={<ReportIssueOrQuery />} />
          <Route path="/bg" element={<BackgroundVideo />} />
          <Route path="*" element={<PageNotFound />} />
            </Routes>
      </Router>
  </div>)
}

export default App;
