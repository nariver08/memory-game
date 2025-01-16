import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import HomeScreen from "./components/HomeScreen";
import "./styles.css";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/game" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);
