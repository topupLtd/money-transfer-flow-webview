import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Extract access token from URL query params and store in localStorage
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
if (token) {
  localStorage.setItem("auth_token", token);
  // Clean the token from the URL to avoid leaking it in bookmarks/history
  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, "", url.toString());
}

createRoot(document.getElementById("root")!).render(<App />);
