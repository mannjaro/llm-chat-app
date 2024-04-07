import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/cognito";
function App() {
  const { fetchSession } = useAuth();
  useEffect(() => {
    fetchSession();
  }, []);
  return (
    <>
      <Outlet />
      <ul>
        <li>
          <NavLink
            style={({ isActive }) => (isActive ? { color: "gray" } : undefined)}
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            style={({ isActive }) => (isActive ? { color: "gray" } : undefined)}
            to="/about"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            style={({ isActive }) => (isActive ? { color: "gray" } : undefined)}
            to="/chat"
          >
            Chat
          </NavLink>
        </li>
        <li>
          <NavLink
            style={({ isActive }) => (isActive ? { color: "gray" } : undefined)}
            to="/auth"
          >
            Auth
          </NavLink>
        </li>
      </ul>
    </>
  );
}

export default App;
