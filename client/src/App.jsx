import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Layout from "./layouts/Layout";
import AppProvider from "./context/AppProvider";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index path="/" element={<Dashboard />} />
            <Route path="/:folderId" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<h1> Page Not Found</h1>} />
      </Routes>
    </AppProvider>
  );
}

export default App;
