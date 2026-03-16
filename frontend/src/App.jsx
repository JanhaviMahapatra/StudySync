import {Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Buddies from "./pages/Buddies";
import Chat from "./pages/Chat";

export default function App() {
return (
<Routes>
<Route path="/register" element={<Register/>}/>
<Route path="/login" element={<Login />} />
<Route path="/me" element={<Dashboard/>}/>
<Route path="/onboarding" element={<Onboarding />} />
<Route path="/" element={<LandingPage/>}/>
<Route path="/matches" element={<Matches />} />
<Route path="/requests" element={<Requests/>}/>
<Route path="/my-buddies" element={<Buddies/>} />
<Route  path="/chat/:buddyId" element={<Chat/>}></Route>
</Routes>
  );
}

