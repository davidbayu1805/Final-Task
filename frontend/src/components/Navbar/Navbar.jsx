import { useEffect, useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [user, setUser] = useState(null);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const storedUser = AuthService.getCurrentUser();
    setUser(storedUser);
  };

  const handleSectionClick = (section) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setScroll(true);
        setShow(false);
      } else {
        setScroll(false);
      }
    };

    checkAuthStatus();

    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleClick = () => {
    setShow(!show);
  };

  let menuActive = show ? "left-0" : "-left-full";

  let scrollActive = scroll
    ? `py-6 ${darkMode ? "bg-gray-900" : "bg-white"} shadow transition-all duration-300`
    : `py-4 ${darkMode ? "bg-gray-900" : "bg-transparent"} transition-all duration-300`;

  const scrollOffset = -80;

  return (
    <div className={`navbar w-full z-50 sticky top-0 ${scrollActive}`}>
      <div className="container mx-auto px-6 lg:px-8 xl:px-12">
        <div className="navbar-box flex items-center justify-between">
          <div className="logo">
            <RouterLink to="/">
              <img
                src="/public/logo.jpg"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </RouterLink>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <ul className={`hidden lg:flex lg:gap-6 xl:gap-8 items-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              <li>
                {location.pathname === "/" ? (
                  <ScrollLink
                    to="tech"
                    smooth={true}
                    duration={500}
                    offset={scrollOffset}
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                    activeClass="opacity-100"
                    spy={true}
                  >
                    Tech Stack
                  </ScrollLink>
                ) : (
                  <button
                    onClick={() => handleSectionClick("tech")}
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Tech Stack
                  </button>
                )}
              </li>
              <li>
                {location.pathname === "/" ? (
                  <ScrollLink
                    to="experience"
                    smooth={true}
                    duration={500}
                    offset={scrollOffset}
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                    activeClass="opacity-100"
                    spy={true}
                  >
                    Experience
                  </ScrollLink>
                ) : (
                  <button
                    onClick={() => handleSectionClick("experience")}
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Experience
                  </button>
                )}
              </li>
              <li>
                {location.pathname === "/" ? (
                  <ScrollLink
                    to="project"
                    smooth={true}
                    duration={500}
                    offset={scrollOffset}
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                    activeClass="opacity-100"
                    spy={true}
                  >
                    Project
                  </ScrollLink>
                ) : (
                  <button
                    onClick={() => handleSectionClick("project")}
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Project
                  </button>
                )}
              </li>
              <li>
                {user ? (
                  <RouterLink
                    to="/myproject"
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity"
                  >
                    Add Project
                  </RouterLink>
                ) : (
                  <RouterLink
                    to="/login"
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity"
                  >
                    Add Project
                  </RouterLink>
                )}
              </li>
            </ul>

            <div className="social flex items-center gap-2 lg:gap-3">
              {user ? (
                <>
                  <span className="hidden md:block text-sm font-medium">
                    Hi, {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-900 px-5 py-2 rounded-full text-white font-bold hover:bg-gray-700 transition-all text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <RouterLink
                    to="/login"
                    className="bg-gray-900 px-5 py-2 rounded-full text-white font-bold hover:bg-gray-700 transition-all text-sm"
                  >
                    Login
                  </RouterLink>
                  <RouterLink
                    to="/login?mode=register"
                    className="bg-blue-500 px-5 py-2 rounded-full text-white font-bold hover:bg-blue-600 transition-all text-sm"
                  >
                    Register
                  </RouterLink>
                </>
              )}

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <i className="ri-sun-line text-xl text-yellow-400"></i>
                ) : (
                  <i className="ri-moon-line text-xl text-gray-600"></i>
                )}
              </button>

              <i
                className={`ri-menu-3-line text-3xl lg:hidden block cursor-pointer ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={handleClick}
              ></i>
            </div>
          </div>

          {/* Mobile Menu */}
          <ul
            className={`flex lg:hidden gap-3 fixed ${menuActive} top-1/2 -translate-y-1/2 flex-col px-8 py-6 rounded-r-lg shadow-lg shadow-slate-300 ${
              darkMode ? "bg-gray-800" : "bg-gray-600"
            } font-bold text-white transition-all duration-300`}
          >
            <li className="flex items-center gap-3">
              <i className="ri-global-line text-xl"></i>
              {location.pathname === "/" ? (
                <ScrollLink
                  to="tech"
                  smooth={true}
                  duration={500}
                  offset={scrollOffset}
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => setShow(false)}
                  activeClass="opacity-100"
                  spy={true}
                >
                  Tech Stack
                </ScrollLink>
              ) : (
                <button
                  onClick={() => {
                    handleSectionClick("tech");
                    setShow(false);
                  }}
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Tech Stack
                </button>
              )}
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-tools-line text-xl"></i>
              {location.pathname === "/" ? (
                <ScrollLink
                  to="experience"
                  smooth={true}
                  duration={500}
                  offset={scrollOffset}
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => setShow(false)}
                  activeClass="opacity-100"
                  spy={true}
                >
                  Experience
                </ScrollLink>
              ) : (
                <button
                  onClick={() => {
                    handleSectionClick("experience");
                    setShow(false);
                  }}
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Experience
                </button>
              )}
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-image-line text-xl"></i>
              {location.pathname === "/" ? (
                <ScrollLink
                  to="project"
                  smooth={true}
                  duration={500}
                  offset={scrollOffset}
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => setShow(false)}
                  activeClass="opacity-100"
                  spy={true}
                >
                  Project
                </ScrollLink>
              ) : (
                <button
                  onClick={() => {
                    handleSectionClick("project");
                    setShow(false);
                  }}
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Project
                </button>
              )}
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-add-circle-line text-xl"></i>
              {user ? (
                <RouterLink
                  to="/myproject"
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity"
                  onClick={() => setShow(false)}
                >
                  Add Project
                </RouterLink>
              ) : (
                <RouterLink
                  to="/login"
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity"
                  onClick={() => setShow(false)}
                >
                  Add Project
                </RouterLink>
              )}
            </li>
            {user ? (
              <li className="flex items-center gap-3">
                <i className="ri-logout-box-line text-xl"></i>
                <button
                  onClick={() => {
                    handleLogout();
                    setShow(false);
                  }}
                  className="font-medium opacity-75 hover:opacity-100 transition-opacity"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="flex items-center gap-3">
                  <i className="ri-login-box-line text-xl"></i>
                  <RouterLink
                    to="/login"
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity"
                    onClick={() => setShow(false)}
                  >
                    Login
                  </RouterLink>
                </li>
                <li className="flex items-center gap-3">
                  <i className="ri-user-add-line text-xl"></i>
                  <RouterLink
                    to="/login?mode=register"
                    className="font-medium opacity-75 hover:opacity-100 transition-opacity"
                    onClick={() => setShow(false)}
                  >
                    Register
                  </RouterLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;