import "./App.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HandEntry from "./pages/handentry";
import HandHistory from "./pages/handhistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HandEntry />} />
        <Route path="/history" element={<HandHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
