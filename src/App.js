import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import UserList from "./pages/UserList";
import TeamList from "./pages/TeamList";
import PositionList from "./pages/PositionList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/teams" element={<TeamList />} />
        <Route path="/positions" element={<PositionList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;