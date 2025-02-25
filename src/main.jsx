import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider } from "react-photo-view";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <PhotoProvider>
        <App />
      </PhotoProvider>
    </HeroUIProvider>
  </StrictMode>
);
