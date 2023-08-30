import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "../pages/signin";
import Streamer from "../pages/streamer";
import Viewer from "../pages/viewer";
import { Navigate } from "react-router-dom";
import.meta.hot;
const MainRouter = () => {

  return (
    <Routes>
      <Route path="/" element={<Navigate  to="/viewer/room1" />} />
        <Route path="/streamer/room1" element={<Streamer />} />
        <Route path="/viewer/room1" element={<Viewer />} />
        <Route path="/signin" element={<Signin />} />

    </Routes>
  );
};

export default MainRouter;
