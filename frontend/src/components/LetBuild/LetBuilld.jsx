import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const ContactSection = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`py-16 px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto max-w-4xl">
        <div className="text-center px-6 py-12 rounded-xl">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Let's build something together
          </h2>

          <p
            className={`text-sm mb-8 leading-normal ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Feel free to reach out if you're looking for a developer, have a
            question, or just want to connect.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <a
                href="mailto:davidbayu57@gmail.com"
                className={`font-medium transition-all text-left ${
                  darkMode
                    ? "text-white hover:text-blue-400"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                <i className="ri-mail-line mr-2"></i>davidbayu57@gmail.com
              </a>

              <span
                className={`hidden md:block mx-2 ${
                  darkMode ? "text-gray-400" : "text-black"
                }`}
              >
                |
              </span>
            </div>

            <a
              href="tel:+6281229108586"
              className={`font-medium transition-all ${
                darkMode
                  ? "text-white hover:text-gray-400"
                  : "text-gray-800 hover:text-gray-600"
              }`}
            >
              <i className="ri-whatsapp-line mr-2"></i>+62 812-291-08586
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;