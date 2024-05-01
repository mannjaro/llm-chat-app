import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "./hooks/cognito";

import Navbar from "./components/Navbar";

function App() {
  const { fetchSession } = useAuth();
  useEffect(() => {
    fetchSession();
  }, []);
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </>
  );
}

export default App;
