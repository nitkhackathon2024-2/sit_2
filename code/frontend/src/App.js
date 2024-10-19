import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Container, Grid } from "@material-ui/core";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import Chat from "./components/Chat/Chat";
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/Layout/Navbar";
import MatchList from "./components/Dashboard/MatchList";
import SkillMatching from "./components/SkillMatching/SkillMatching";
import GamificationPage from "./components/Gamification/Gamification";
import LearningPathPage from "./components/LearningPathPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/learning-path" element={<LearningPathPage />} />
                <Route path="/gamification" element={<GamificationPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<MatchList />} />
                  <Route path="/chat/:otherUserId" element={<Chat />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/chat/:matchId" element={<Chat />} />
                  <Route path="/skill-matching" element={<SkillMatching />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
