import { useDarkMode } from "../../contexts/DarkModeContext";

const Footer = () => {
  const { darkMode } = useDarkMode();

  return (
    <div 
      className={`footer ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow mt-20 transition-colors duration-300`} 
      id="Social"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col items-center text-center gap-4 -mt-21">
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
          &copy; Copyright by <span className="font-bold">Crish00_</span>
        </p>
        <div className="social-footer flex gap-4">
          <a
            href="https://www.instagram.com/crish00_?igsh=MXcxbzV3OXg3ZzQwZw=="
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <i className="ri-instagram-fill text-2xl text-pink-500 hover:text-pink-600"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/david-bayu"
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <i className="ri-linkedin-box-fill text-2xl text-blue-600 hover:text-blue-700"></i>
          </a>
          <a
            href="https://github.com/davidbayu1805"
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <i className={`ri-github-fill text-2xl ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-900'} transition-colors duration-200`}></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;