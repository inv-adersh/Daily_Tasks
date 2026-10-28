import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/common/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  
  <StrictMode>
    <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
    </ErrorBoundary>
  </StrictMode>,
);