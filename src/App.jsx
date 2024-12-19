// src/App.js
import React from "react";
import { Route, Routes } from "react-router";
import Home from "./components/Home";
import GamingTrivia from "./components/GamingTrivia";
import AnimeTrivia from "./components/AnimeTrivia";
import MoviesTrivia from "./components/MoviesTrivia";
import Nav from "./components/Nav";
import "./App.css";

function App() {
  return (
    <div className="App">
      <video autoPlay loop muted playsInline className="background-clip">
        <source src="../dragonVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gaming" element={<GamingTrivia />} />
        <Route path="/anime" element={<AnimeTrivia />} />
        <Route path="/movies" element={<MoviesTrivia />} />
      </Routes>
    </div>
  );
}

export default App;
