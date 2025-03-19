import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TranscriptionDashboard from "./pages/transcription-dashboard.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./pages/layout.tsx";
import NotFound from "./pages/not-found.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Layout sets the container with height 100vh, width set by container */}
        {/* Direct children should not set margin or height will be greater than 100vh. */}
        <Route element={<Layout />}>
          <Route path="/" element={<TranscriptionDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
