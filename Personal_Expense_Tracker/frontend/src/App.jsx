import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Toaster } from "react-hot-toast";




function App() {
  return (
    
    <BrowserRouter>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />


      <Routes>
        <Route element={<AppLayout />}>
      
          <Route path="/" element={<DashboardPage />} />

          <Route
            path="/transactions"
            element={<TransactionsPage />}
          />

          <Route
            path="/budgets"
            element={<BudgetsPage />}
          />
        </Route>

         <Route path="*" element={<NotFoundPage />}  /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;