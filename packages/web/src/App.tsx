import "./App.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HandEntry from "./pages/handentry";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HandEntry />} />
      </Routes>
    </Router>
  );
}

export default App;
