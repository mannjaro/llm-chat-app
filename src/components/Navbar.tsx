import { NavLink } from "react-router-dom";
function Navbar() {
  return (
    <>
      <header className="flex justify-between p-2 mx-2 mt-2 shadow ">
        <NavLink to="/" className="font-bold text-2xl">
          Home
        </NavLink>
        <nav className="flex items-center font-semibold gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-gray-300" : "text-inherit"
            }
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-gray-300" : undefined
            }
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-gray-300" : undefined
            }
            to="/chat"
          >
            Chat
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-gray-300" : undefined
            }
            to="/auth"
          >
            Auth
          </NavLink>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
