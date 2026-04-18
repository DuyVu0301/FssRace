import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import authStore from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = authStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            FSS Race
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/races")}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Races
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {user.username}
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <button
              onClick={() => {
                navigate("/races");
                setIsOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
            >
              Races
            </button>

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/leaderboard");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
                >
                  Profile
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setIsOpen(false);
                    }}
                    className="block w-full text-left bg-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
